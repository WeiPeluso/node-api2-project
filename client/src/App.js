import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Post from "./components/Post.js";
function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({
    title: "",
    contents: "",
  });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/posts`)
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const postInputChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    axios
      .post("http://localhost:4000/api/posts", post)
      .then((res) => {
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <div className="addPost">
        <h2>Add a Post</h2>
        <form className="form" onSubmit={onSubmit}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={postInputChange}
          />
          <label>Content:</label>
          <input
            type="text"
            name="contents"
            value={post.contents}
            onChange={postInputChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      {posts.map((post) => {
        return (
          <div className="post">
            <Post
              key={post.id}
              post={post}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
        );
      })}
    </div>
  );
}

export default App;
