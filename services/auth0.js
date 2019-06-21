import auth0 from "auth0-js";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import { getCookieFromReq } from "../helpers/utils";

const CLIENT_ID = process.env.CLIENT;

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "dev-0kws86jw.auth0.com",
      clientID: CLIENT_ID,
      redirectUri: `${process.env.BASE_URL}/callback`,
      responseType: "token id_token",
      scope: "openid profile"
    });
    this.login = this.login.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);

    this.logout = this.logout.bind(this);
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          resolve();
        } else if (err) {
          reject(err);
        }
      });
    });
  }

  login() {
    this.auth0.authorize();
  }

  async getJWKS() {
    const res = await axios.get(
      "https://dev-0kws86jw.auth0.com/.well-known/jwks.json"
    );
    const jwks = res.data;
    return jwks;
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    // this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    Cookies.set("jwt", authResult.idToken);

    // navigate to the home route
  }

  logout() {
    Cookies.remove("jwt");
    const auth = this.auth0;

    auth.logout({
      returnTo: "",
      clientId: CLIENT_ID
    });
  }

  async verifyToken(token) {
    if (token) {
      const decodedToken = jwt.decode(token, { complete: true });
      if (!decodedToken) {
        return undefined;
      }
      const jwks = await this.getJWKS();
      const jwk = jwks.keys[0];

      // BUILD CERTIFICATE
      let cert = jwk.x5c[0];
      cert = cert.match(/.{1,64}/g).join("\n");
      cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;

      if (jwk.kid === decodedToken.header.kid) {
        try {
          const verifiedToken = jwt.verify(token, cert);
          const expiresAt = verifiedToken.exp * 1000;

          return verifiedToken && new Date().getTime() < expiresAt
            ? verifiedToken
            : undefined;
        } catch (err) {
          return undefined;
        }
      }
    }

    return undefined;
  }

  async clientAuth() {
    const token = Cookies.getJSON("jwt");
    const verifiedToken = await this.verifyToken(token);

    return verifiedToken;
  }

  async serverAuth(req) {
    if (req.headers.cookie) {
      const token = getCookieFromReq(req, "jwt");
      const verifiedToken = await this.verifyToken(token);
      return verifiedToken;
    }
    return undefined;
  }
}

const auth0Client = new Auth();
export default auth0Client;
