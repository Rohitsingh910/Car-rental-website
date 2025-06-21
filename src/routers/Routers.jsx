import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import CarListing from "../pages/CarListing.jsx";
import CarDetails from "../pages/CarDetails.jsx";
import Blog from "../pages/Blog.jsx";
import BlogDetails from "../pages/BlogDetails.jsx";
import NotFound from "../pages/NotFound.jsx";
import Contact from "../pages/Contact.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cars" element={<CarListing />} />
      <Route path="/cars/:slug" element={<CarDetails />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
