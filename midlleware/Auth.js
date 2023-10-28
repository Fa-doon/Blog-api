const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
require("dotenv").config();

async function checkAuth(req, res, next) {
  try {
    const body = req.headers.authorization;

    if (!body) {
      return res.status(401).json({
        message: `Unauthorized`,
      });
    }

    const token = await body.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({ message: `Unauthorized` });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: `invalid or expired token`,
    });
  }
}

module.exports = { checkAuth };
