// import "./App.css";
import { useState, useEffect } from "react";
import dashboard_img from "../assets/home_page_img.png";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const navigatehandler = () => {
    navigate("/restake");
  };

  return (
    <div className="home_container">
      <div className="home_upper">
        <div className="home_container_left">
          <h1>SSV Restaking</h1>
          <p>
            Native Restaking redirects an Ethereum validator's withdrawal
            credentials to an EigenPod, requiring a new validator setup.
            <br />
            <br />
            With ssv.network, you don't need to manage your own validator
            hardware. Simply register on the network and select operators to run
            the validator for you.
          </p>
          <div className="home_container_button">
            <button className="button_github" onClick={navigatehandler}>
              Start Restaking
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
