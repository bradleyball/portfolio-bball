const express = require("express");
const blogCtrl = require("../controllers/blog");
const router = express.Router();
const authService = require("../services/auth");

router.get("/:id", blogCtrl.getBlogById);

router.post(
  "",
  authService.checkJWT,
  authService.checkRole("siteOwner"),
  blogCtrl.createBlog
);

router.patch(
  "/:id",
  authService.checkJWT,
  authService.checkRole("siteOwner"),
  blogCtrl.updateBlog
);

// router.get("", blogCtrl.getblogs);
// router.get("/:id", blogCtrl.getblogById);
// router.patch(
//   "/:id",
//   authService.checkJWT,
//   authService.checkRole("siteOwner"),
//   blogCtrl.updateblog
// );

// router.delete(
//   "/:id",
//   authService.checkJWT,
//   authService.checkRole("siteOwner"),
//   blogCtrl.deleteblog
// );

// router.patch("/:id", bookCtrl.updateBook);

// router.delete("/:id", bookCtrl.deleteBook);

module.exports = router;
