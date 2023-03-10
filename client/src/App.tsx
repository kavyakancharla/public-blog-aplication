import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PostForm from "./pages/PostForm";
import Dashboard from "./pages/Dashboard";
import Post from "./pages/Post";
import NoPageFound from "./pages/NoPageFound";
import UpdateForm from "./pages/UpdateForm";

function App() {
  interface IPost {
    _id: string;
    title: string;
    body: string;
    author: {
      [key: string]: any;
    };
    date: Date;
    published: boolean;
    imageUrl: string;
  }

  const [user, setUser] = useState<any>();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    // make sure user is still logged in
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }

    axios
      .get("/api/posts")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <header>
        <Nav user={user} setUser={setUser} />
      </header>
      <Routes>
        {/* Pages  */}
        <Route path="/" element={<Home user={user} posts={posts} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/create"
          element={<PostForm posts={posts} setPosts={setPosts} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard posts={posts} setPosts={setPosts} />}
        />
        {/* Posts  */}
        {posts.map((post) => (
          <Route
            key={post._id}
            path={`/posts/${post._id}`}
            element={<Post {...post} user={user} />}
          />
        ))}
        {posts.map((post) => (
          <Route
            key={post._id}
            path={`/posts/${post._id}/update`}
            element={<UpdateForm {...post} setPosts={setPosts} />}
          />
        ))}
        {/* No page found */}
        <Route path="*" element={<NoPageFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
