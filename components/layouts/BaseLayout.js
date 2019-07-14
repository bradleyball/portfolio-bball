import React from "react";
import Header from "../shared/Header";
import Head from "next/head";

const BaseLayout = props => {
  const { className, children, isAuthenticated, user, isSiteOwner } = props;
  const headerType = props.headerType || "default";
  const title = props.title || "Bradley Ball";

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>

        <meta
          name="description"
          content="My name is Bradley Ball and I am a software engineer. I love solving problems and collaberating with teammates to get the job done. React is my favorite frontend framework and nodejs is my preferred backend technology."
        />
        <meta
          name="keywords"
          content="bradley ball, bradley ball porfolio, bradley ball developer, bradley, bradley portfolio"
        />

        <meta
          property="og:title"
          content="Bradley Ball - programmer,devoloper, blogger"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale" content="en_EU" />
        <meta property="og:url" content={process.env.BASE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="My name is Bradley Ball and I am a software engineer. I love solving problems and collaberating with teammates to get the job done. React is my favorite frontend framework and nodejs is my preferred backend technology."
        />
        <link rel="icon" type="image/ico" href="/static/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="layout-container">
        <Header
          className={`port-nav-${headerType}`}
          isAuthenticated={isAuthenticated}
          user={user}
          isSiteOwner={isSiteOwner}
        />
        <main className={`cover ${className}`}>
          <div className="wrapper">{children}</div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default BaseLayout;
