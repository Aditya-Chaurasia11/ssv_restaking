import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";
import { useWeb3 } from "../api/contextapi";
import metamask from "../assets/metamask.svg";
import { ethers } from "ethers";

const Navbar = () => {
  const {
    account,
    setAccount,
    provider,
    setProvider,
    contract,
    setContract,
    setSigner,
  } = useWeb3();

  function handleClick() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
          const Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(Provider);
          const Signer = Provider.getSigner();
          setSigner(Signer);
        });
    }
  }

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/">
            {/* <img src={logo}></img> */}
            SSV Restaking
          </Link>
        </div>
      </div>

      <div className="gpt3__navbar-sign">
        <button type="button" className="navbar_my_nft_button_add">
          {account ? (
            <>
              <img src={metamask}></img> {account?.slice(0, 6)}...
              {account?.slice(account.length - 4, account.length)}
            </>
          ) : (
            <button
              type="button"
              className="navbar_my_nft_button_add"
              onClick={handleClick}
            >
              Connect wallet
            </button>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
