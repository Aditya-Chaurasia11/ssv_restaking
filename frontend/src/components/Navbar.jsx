import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";
import { useEffect } from "react";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.className = theme === "light" ? "" : "dark";
  }, [theme]);

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
        <button
          type="button"

          // onClick={loadAddress}
        >
          {/* {account
            ? `${account?.slice(0, 6)}...${account?.slice(
                account.length - 4,
                account.length
              )}`
            : "Connect wallet"} */}
          <ConnectButton />
        </button>
        <button
          onClick={toggleTheme}
          style={{
            padding: "10px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>{" "}
        {/* <ModeToggle/> */}
        {/* <Link to="/collection">
          <button type="button" className="navbar_my_nft_button">
            Collection{" "}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="#ffffff"
                d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
              />
            </svg>
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
