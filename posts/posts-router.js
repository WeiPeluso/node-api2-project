const express = require("express");

const Posts = require("../data/db.js");

const router = express.Router();

//get all the post
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json({ query: req.query, data: posts });
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

//post posts
router.post("/", (req, res) => {
  const newPost = req.body;
  if (newPost.title && newPost.contents) {
    Posts.insert(newPost)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: "Error adding the post",
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
});

//get a post with a specific id

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

//Creates a comment for the post with the specified id using information
//sent inside of the request body.
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const newComment = { ...req.body, post_id: id };

  Posts.findById(id)
    .then(() => {
      Posts.insertComment(newComment)
        .then((comment) => {
          res.status(200).json({ data: comment });
        })
        .catch((err) => {
          console.log(err.message);
          res
            .status(500)
            .json({ errorMessage: "we could not add the comment" });
        });
    })
    .catch(() => {
      res.status(404).json({
        message: "The post with the specified ID does not exist.",
      });
    });
});

//Returns an array of all the comment objects associated with the
//post with the specified id.
//	/api/posts/:id/comments

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  if (!Posts.findById(id)) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else {
    Posts.findPostComments(id)
      .then((comments) => {
        res.status(200).json(comments);
      })
      .catch((err) => {
        console.log(err.message);
        res
          .status(500)
          .json({ errorMessage: "we could not get the posts data" });
      });
  }
});

//delete a specific post
router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been nuked" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the hub",
      });
    });
});

//update a post with a specified id
router.put("/:id", (req, res) => {
  const changes = req.body;

  if (!Posts.findById(id)) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else if (changes.title && changes.contents) {
    Posts.update(req.params.id, changes)
      .then((post) => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: "The post could not be found" });
        }
      })
      .catch((error) => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: "The post information could not be modified.",
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
});

module.exports = router;
