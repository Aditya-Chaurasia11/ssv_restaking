import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";
import { useWeb3 } from "../api/contextapi";
import metamask from "../assets/metamask.svg";

const Navbar = () => {
  const { account, setAccount, provider, setProvider, contract, setContract } =
    useWeb3();

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/">
            {/* <img src={logo}></img> */}
            sfdffs
          </Link>
        </div>
      </div>

      <div className="gpt3__navbar-sign">
        <button type="button" className="navbar_my_nft_button_add">
          <img src={metamask}></img>
          {account
            ? `${account?.slice(0, 6)}...${account?.slice(
                account.length - 4,
                account.length
              )}`
            : "Connect wallet"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
