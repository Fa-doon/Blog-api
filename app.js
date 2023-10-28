const express = require("express");
const usersRoute = require("./users/users-route");
const blogsRoute = require("./blogs/blog-route");

const app = express();

app.use(express.json());

app.use("/users", usersRoute);
app.use("/blogs", blogsRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `Hello Blogger`,
    success: true,
  });
});

app.get("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: `Route not found`,
  });
});

// global error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    data: null,
    error: "Server Error",
  });
});
module.exports = app;
