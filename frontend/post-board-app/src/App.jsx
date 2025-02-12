import React from "react";
import { ToastContainer } from "react-toastify";
import { AppContextProvider } from "./context/AppContext";
import "./App.css"; // Or your main CSS file
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Login from "./components/Login";
import Header from "./components/Header";
import "react-toastify/dist/ReactToastify.css";
import MyPosts from "./pages/MyPosts";
import NewPost from "./pages/NewPost";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <AppContextProvider>
      <ToastContainer position="top-left" autoClose={2000} /> <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-post" element={<MyPosts />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/home-page" element={<HomePage />} />
      </Routes>
    </AppContextProvider>
  );
}

export default App;
