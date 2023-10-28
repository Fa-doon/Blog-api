const Model = require("../models/blog");
const userModel = require("../models/user");
const logger = require("../logger/index");

//  CREATE BLOG
async function createBlog(req, res) {
  try {
    logger.info("createBlog => creating blog statrted");
    const blog = req.body;
    const { _id, first_name, last_name } = req.user;

    const author = `${first_name} ${last_name}`;
    (blog.author = author), (blog.authorId = _id);

    logger.info("createBlog => blog created");
    const blogPost = await Model.create(blog);

    logger.info("createBlog => creating blog ended");
    return res.status(200).json({
      message: `Blogs successfully created`,
      blogPost,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: `Something went wrong`, error: error.message });
  }
}

// Get all published blogs
async function getAllPublishedBlogs(req, res) {
  try {
    logger.info("publishedBlogsRequest => process started");
    const { page = 1, limit = 20, title, tags, sort, author } = req.query;
    const query = { state: "published" };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (tags) {
      query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const options = {
      page: page,
      limit: limit,
    };

    if (sort) {
      if (["read_count", "reading_time", "timestamp"].includes(sort)) {
        options.sort = `-${sort}`; // to ensure that it sorts in descending order
      }
    }

    const result = await Model.paginate(query, options);

    if (result.docs.length === 0) {
      return res.status(404).json({
        message: `No blogs found`,
      });
    }

    logger.info("publishedBlogsRequest => process ended");
    return res.status(200).json({
      message: `Blogs successfully retrieved`,
      data: result.docs,
      page: result.page,
      totalPages: result.pages,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
}

// GET A LIST OF OWNER'S BLOG
async function getAuthorBlogs(req, res) {
  try {
    logger.info("allAuthorBlogsRequest => process started");
    const { page = 1, limit = 20, state, title } = req.query;
    const userId = req.user._id;

    const query = { authorId: userId };

    if (state) {
      query.state = state;
    }
    if (title) {
      query.title = title;
    }

    const options = {
      page: page,
      limit: limit,
    };

    const result = await Model.paginate(query, options);

    if (result.docs.length === 0) {
      return res.status(404).json({
        message: `No blogs found`,
      });
    }

    logger.info("allAuthorBlogsRequest => process ended");
    return res.status(200).json({
      message: `Blogs successfully retrieved`,
      data: result.docs,
      page: result.page,
      totalPages: result.pages,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
}

// Get a published blog
async function getBlogById(req, res) {
  logger.info("blogRequest => process started");
  const blogId = req.params.id;

  try {
    const blog = await Model.findOne({ _id: blogId, state: "published" });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment the read_count
    blog.read_count += 1;
    await blog.save();

    logger.info("blogRequest => process ended");
    res.status(200).json({
      status: true,
      blog,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// UPDATE A BLOG
async function updateBlog(req, res) {
  try {
    logger.info("blogUpdateRequest => process started");
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: `Please provide an id!` });
    }

    const updateDetails = req.body;

    const blog = await Model.findById(id);
    if (!blog) {
      return res.status(404).json({
        message: `Blog not found`,
      });
    }

    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: `Unauthorized`,
      });
    }

    for (const detail in updateDetails) {
      if (detail === "title" || detail === "description" || detail === "body" || detail === "tags") {
        blog[detail] = updateDetails[detail];
      } else if (detail === "state") {
        if (updateDetails[detail] === "draft" || updateDetails[detail] === "published") {
          blog[detail] = updateDetails[detail];
        } else {
          res.status(400).json({
            message: `Invalid state`,
          });
        }
      }
    }

    await blog.save();

    logger.info("blogUpdateRequest => process ended");
    return res.status(200).json({
      message: `Blog updated successfully`,
      blog,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

// DELETE A BLOG
async function deleteBlog(req, res) {
  try {
    logger.info("blogDeletionRequest => process started");
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "ID is required to delete a blog",
      });
    }

    const blog = await Model.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: `Blog not found`,
      });
    }

    logger.info("blogDeletionRequest => process ended");
    if (blog.authorId.toString() === req.user._id.toString()) {
      await blog.deleteOne();
      return res.status(200).json({
        message: `Post deleted successfully`,
      });
    } else {
      return res.status(403).json({
        message: `Unauthorized`,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createBlog,
  getAllPublishedBlogs,
  getAuthorBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
