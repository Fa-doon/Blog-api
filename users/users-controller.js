const Model = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("../logger/index");
require("dotenv").config();

// REGISTER USER
async function createUser(req, res) {
  try {
    logger.info("CreateUser => creation process statrted");

    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    const existingUser = await Model.findOne({ email: user.email });

    if (existingUser) {
      res.status(409).json({
        message: `User already exists`,
      });
      return;
    }

    await Model.create(user)
      .then((data) => {
        logger.info("CreateUser => creation process ended");
        const { password, ...others } = data._doc;
        res.status(201).json({
          message: `Registration successful`,
          data: others,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: `Something went wrong`,
          error: err.message,
        });
      });
  } catch (error) {
    logger.error(error.message);
    console.log(error.message);
    return res.status(500).json({
      message: `Something went wrong`,
      error: null,
    });
  }
}

// LOGIN USER
async function loginUser(req, res) {
  try {
    logger.info("LoginUser => login process statrted");
    const user = {
      username: req.body.username,
      password: req.body.password,
    };

    const existingUser = await Model.findOne({ username: user.username });

    if (!existingUser) {
      return res.status(400).json({
        message: `Invalid credentials`,
      });
    }

    const validPassword = await existingUser.isValidPassword(user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: `Invalid credentials`,
      });
    }

    const token = await jwt.sign({ username: existingUser.username, _id: existingUser._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    logger.info("LoginUser => login process ended");

    return res.status(200).json({
      message: `Login successful`,
      token,
    });
  } catch (error) {
    logger.error(error.message);
    console.log(error.message);
    return res.status(500).json({
      message: `Something went wrong`,
      error: null,
    });
  }
}

module.exports = {
  createUser,
  loginUser,
};
