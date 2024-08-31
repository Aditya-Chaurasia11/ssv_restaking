// import "./App.css";
import { useState, useEffect } from "react";
import dashboard_img from "../assets/homepage_img.png";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const navigatehandler = () => {
    navigate("/collection");
  };

  const navigatehandlerGallery = () => {
    navigate("/gallery");
  };

  return (
    <div className="home_container">
      <div className="home_upper">
        <div className="home_container_left">
          <h1>Craft, Trade & Collect Creative Video NFTs</h1>
          <p>
            Buy, sell, and explore exceptional video NFTs on Theta, the advanced
            platform offering secure and transparent ownership of digital video
            content.
          </p>
          <div className="home_container_button">
            <button className="button_github" onClick={navigatehandlerGallery}>
              Explore now
            </button>
            
          </div>
        </div>
        <div className="home_container_right">
          <img src={dashboard_img}></img>
        </div>
      </div>
    </div>
  );
}

export default Home;
