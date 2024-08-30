import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/">
            {/* <img src={logo}></img> */}
            logo
          </Link>
        </div>
      </div>

      <div className="gpt3__navbar-sign">
        <button type="button">
          <ConnectButton />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
