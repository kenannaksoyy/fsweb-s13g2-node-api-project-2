// implement your server here
// require your posts router and connect it here
const express = require("express");
const server = express();
const postsRouter = require("./posts/posts-router.js");
server.use("/api/posts",postsRouter);

module.exports = server;