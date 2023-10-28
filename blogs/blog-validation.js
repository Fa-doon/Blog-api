const joi = require("joi");

async function validateNewBlog(req, res, next) {
  try {
    const blog = req.body;

    const schema = joi.object({
      title: joi.string().required().messages({
        "string.required": "Title is required",
      }),
      description: joi.string(),
      body: joi.string(),
      tags: joi.array().items(joi.string()),
    });

    await schema.validateAsync(blog, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(422).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
}

module.exports = { validateNewBlog };
