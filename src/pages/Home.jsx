import React from "react";
import { Link } from "react-router-dom";
import image1 from "../assets/banner/2.jpg";

const HomePage = () => {
  return (
    <div
      className="homepage-container"
      style={{
        textAlign: "center",
        padding: "20px",
        height: "100vh",
        color: "#fff",
        backgroundImage: `url(${image1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div></div>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Add a dark overlay for text visibility
          padding: "40px",
          zIndex: 10,
          borderRadius: "10px",
          display: "inline-block",
          marginTop: "10%",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>Car Doctor </h1>

        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          Welcome to Car Doctor, the best place to connect with friends and
          family. Get started by logging in to explore the exciting features we
          have to offer.
        </p>
        <Link
          to={"/login"}
          class="relative inline-flex cursor-pointer text-xl items-center justify-center p-4 px-8 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
        >
          <span class="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
          <span class="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
          <span class="relative cursor-pointer text-white">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
