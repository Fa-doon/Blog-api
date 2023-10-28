const express = require("express");
const middleware = require("./blog-validation");
const controller = require("./blog-controller");
const auth = require("../midlleware/Auth");

const router = express.Router();

router.post("/", auth.checkAuth, middleware.validateNewBlog, controller.createBlog);
router.get("/my-blogs", auth.checkAuth, controller.getAuthorBlogs);
router.get("/published", controller.getAllPublishedBlogs);
router.get("/:id", controller.getBlogById);
router.put("/:id", auth.checkAuth, controller.updateBlog);
router.delete("/:id", auth.checkAuth, controller.deleteBlog);

module.exports = router;
