import React, { useState, useEffect } from "react";
import axios from "axios";

const Post = (props) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ text: "" });
  const [editPost, setEditPost] = useState({
    title: props.post.title,
    contents: props.post.contents,
  });
  const [editToggle, setEditToggle] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/posts/${props.post.id}/comments`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.refresh]);
  const commentInputChange = (e) => {
    setComment({
      text: e.target.value,
    });
  };
  const submitComment = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:4000/api/posts/${props.post.id}/comments`,
        comment
      )
      .then((res) => {
        props.setRefresh(!props.refresh);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:4000/api/posts/${props.post.id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        props.setRefresh(!props.refresh);
      });
  };

  const editPostButton = (e) => {
    e.preventDefault();
    setEditToggle(true);
  };

  const postEditChange = (e) => {
    e.preventDefault();
    setEditPost({
      ...editPost,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(editPost);
    axios
      .put(`http://localhost:4000/api/posts/${props.post.id}`, editPost)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setEditToggle(false);
        props.setRefresh(!props.refresh);
      });
  };
  const cancelEdit = (e) => {
    setEditToggle(false);
  };
  return (
    <>
      {editToggle ? (
        <>
          <form className="form" onSubmit={onSubmit}>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={editPost.title}
              onChange={postEditChange}
            />

            <label>Content:</label>
            <input
              type="text"
              name="contents"
              value={editPost.contents}
              onChange={postEditChange}
            />
            <button onClick={cancelEdit}>Cancel</button>
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <>
          <h2>Title:</h2>
          <p>{props.post.title}</p>
          <h2>Contents:</h2>
          <p>{props.post.contents}</p>
        </>
      )}

      <h3>add a comment</h3>
      <input
        type="text"
        name="comment"
        value={comment.text}
        onChange={commentInputChange}
      />
      <button onClick={submitComment}>Submit</button>
      <h3>Comments</h3>
      {comments.map((comment) => {
        return <p key={comment.id}>{comment.text}</p>;
      })}
      <button onClick={editPostButton}>Edit Post</button>
      <button onClick={deletePost}>Delete Post</button>
    </>
  );
};

export default Post;
