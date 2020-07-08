import React, { useState, useEffect } from "react";
import axios from "axios";

const Post = (props) => {
  const [comments, setComments] = useState([]);

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
  return (
    <>
      <h2>Title:</h2>
      <p>{props.post.title}</p>
      <h2>Contents:</h2>
      <p>{props.post.contents}</p>
      <h3>Comments</h3>

      {comments.map((comment) => {
        return <p key={comment.id}>{comment.text}</p>;
      })}
    </>
  );
};

export default Post;
