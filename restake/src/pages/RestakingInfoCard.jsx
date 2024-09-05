import React, { useEffect, useState } from "react";
import "./restakinginfocard.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWeb3 } from "../api/contextapi";
import abi from "../abi/eigenpodmanagerabi";
import { ethers } from "ethers";

const RestakingInfoCard = () => {
  const navigate = useNavigate();
  const { account, signer, provider } = useWeb3();
  const [showAdd, setShowAdd] = useState(false);
  const [podAddress, setPodAddress] = useState("");
  const [eigenpodmanagerContract, setEigenpodmanagerContract] = useState(null);

  const load = async () => {
    console.log(abi);
    console.log(signer);
    console.log(provider);

    const eigenpodmanagerContract = new ethers.Contract(
      "0x30770d7E3e71112d7A6b7259542D1f680a70e315",
      abi,
      signer
    );

    const podaddress = await eigenpodmanagerContract.ownerToPod(account);
    setPodAddress(podaddress);
    setEigenpodmanagerContract(eigenpodmanagerContract);

    setShowAdd(true);
    if (podaddress === "0x0000000000000000000000000000000000000000") {
      setShowAdd(false);
    }
  };

  const openEtherScan = (address) => {
    window.open(`https://holesky.etherscan.io/address/${address}`);
  };

  useEffect(() => {
    load();
  }, []);

  const copyToClipboard = (add) => {
    navigator.clipboard.writeText(add);
    toast.success(`Copied ${add?.slice(0, 10)}...`, {
      position: "bottom-right",
    });
  };

  const handleClick = async () => {
    if (showAdd === true) {
      navigate("/choose-clustor");
    } else {
      setShowAdd(true);
      console.log("initating");

      if (podAddress === "0x0000000000000000000000000000000000000000") {
        try {
          const tx = await eigenpodmanagerContract.createPod();
          await tx.wait();
          const podaddress = await eigenpodmanagerContract.ownerToPod(account);
          setPodAddress(podaddress);
        } catch (error) {
          console.log(error);

          setShowAdd(false);
        }
      }
    }
  };

  return (
    <div className="restakinginfocard_container_con">
      <div className="restakinginfocard_container">
        <div className="restakinginfocard_upper">
          <h2>About Native Restaking </h2>
          <p>
            Native Restaking means running one or more Ethereum beacon chain
            validators while connected to the EigenLayer protocol. In order to
            participate in Native Restaking, you must run at least one Ethereum
            validator and set its withdrawal address to your EigenPod.
            <br />
            <br />
            Once your EigenPod is deployed and your validator(s) are running,
            the beacon chain will generate rewards for your validators and
            deposit them into your EigenPod. As these rewards accumulate in your
            pod, you can restake them to earn additional rewards through
            EigenLayer or you can withdraw them to your personal wallet.
          </p>
        </div>
        <div className="restakinginfocard_lower">
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#007bff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            {!showAdd ? "CREATE EIGENPOD" : "NEXT"}
          </Button>
        </div>
      </div>
      {showAdd ? (
        <div className="restakingCard_showaddress">
          <h2>EigenPod Address</h2>
          <div>
            {podAddress.slice(0, 8) + "......." + podAddress.slice(26, 32)}{" "}
            <svg
              onClick={() => copyToClipboard("adsad")}
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="w-4 h-4 iconify iconify--mingcute"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                <path
                  fill="currentColor"
                  d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z"
                ></path>
              </g>
            </svg>
          </div>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#007bff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
            onClick={() => {
              openEtherScan(podAddress);
            }}
          >
            VIEW ON ETHERSCAN {"->"}
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RestakingInfoCard;
