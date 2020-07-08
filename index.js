const express = require("express");
const cors = require("cors");
const postRouter = require("./posts/posts-router");

const server = express();
server.use(express.json());
server.use(cors());
server.use("/api/posts", postRouter);
server.get("/", (req, res) => {
  res.send("<h1>Node JS second project</h1>");
});

server.listen(4000, () => {
  console.log("\n*** Server Running on http://localhost:4000 ***\n");
});
