const express = require("express");
const middleware = require("./user-validation");
const controller = require("../users/users-controller");

const router = express.Router();

router.post("/sign-up", middleware.validateNewUser, controller.createUser);
router.post("/login", middleware.validateLogin, controller.loginUser);

module.exports = router;
