const Blog = require("../models/blog");
const AsyncLock = require("async-lock");
const slugify = require("slugify");
const lock = new AsyncLock();
console.log("async");

exports.getBlogs = (req, res) => {
  Blog.find({ status: "published" }, (err, publishedBlogs) => {
    if (err) {
      return res.status(422).send(err);
    }
    return res.json({ publishedBlogs });
  });
};

exports.getBlogById = (req, res) => {
  const blogId = req.params.id;
  Blog.findById(blogId, (err, foundBlog) => {
    if (err) {
      return res.status(422).send(err);
    }

    return res.json(foundBlog);
  });
};

exports.createBlog = (req, res) => {
  const lockId = req.query.lockId;

  if (!lock.isBusy()) {
    lock.acquire(
      lockId,
      function(done) {
        const blogData = req.body;

        const blog = new Blog(blogData);

        if (req.user) {
          blog.userId = req.user.sub;
          blog.author = req.user.name;
        }

        blog.save((err, createdBlog) => {
          setTimeout(() => {
            done();
          }, 5000);

          if (err) {
            return res.status(422).send(err);
          }

          return res.json(createdBlog);
        });
      },
      function(err, ret) {
        err && console.error(err);
      }
    );
  } else {
    return res.status(422).send({ message: "Blog is saving" });
  }
};

exports.updateBlog = (req, res) => {
  const blogId = req.params.id;
  const blogData = req.body;

  Blog.findById(blogId, (err, foundBlog) => {
    if (err) {
      console.error(err);
      return res.status(422).send(err);
    }
    if (blogData.status && blogData.status === "published" && !foundBlog.slug) {
      foundBlog.slug = slugify(foundBlog.title, {
        replacement: "-", // replace spaces with replacement
        remove: null, // regex to remove characters
        lower: true // result in lower case
      });
    }
    foundBlog.set(blogData);
    foundBlog.updatedAt = new Date();
    foundBlog.save((err, foundBlog) => {
      if (err) {
        return res.status(422).send(err);
      }
      return res.json(foundBlog);
    });
  });
};

exports.getUserBlogs = (req, res) => {
  const userId = req.user.sub;

  Blog.find({ userId }, function(err, userBlogs) {
    if (err) {
      return res.status(422).send(err);
    }
    return res.json(userBlogs);
  });
};

exports.deleteBlog = (req, res) => {
  const blogId = req.params.id;
  Blog.deleteOne({ _id: blogId }, err => {
    if (err) {
      return res.status(422).send(err);
    }
    res.json({ status: "deleted" });
  });
};
