const blog = require("../models/blog");

exports.createBlog = (req, res) => {
  const blogData = req.body;

  const blog = new Blog(blogData);

  if (req.user) {
    blog.userId = user.sub;
    blog.author = user.name;
  }

  blog.save((err, createdBlog) => {
    if (err) {
      return res.status(422).send(err);
    }

    return res.json(createdBlog);
  });
};
