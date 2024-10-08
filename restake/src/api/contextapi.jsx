import { ethers } from "ethers";
import React, { createContext, useState, useContext, useEffect } from "react";
import abi from "../abi/abi";

const Web3Context = createContext();

export const Web3provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const loadProvider = async () => {
        if (provider) {
          // window.ethereum.on("chainChanged", () => {
          //   // Chain has changed, so reload the page
          //   window.location.reload();
          // });

          // window.ethereum.on("accountsChanged", () => {
          //   // Accounts have changed, so reload the page
          //   window.location.reload();
          // });

          await provider.send("eth_requestAccounts");
          const Signer = await provider.getSigner();
          const address = await Signer.getAddress();
          setAccount(address);
          setSigner(Signer);

          const network = await provider.getNetwork();
          if (network.chainId !== 0x4268) {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x4268" }],
              });
            } catch (switchError) {
              if (switchError.code === 4902) {
                alert(
                  "holesky network not available in your MetaMask. Please add it manually."
                );
              } else {
                console.error("Failed to switch network:", switchError);
              }
            }
          }

          let contractAddress = "0x38A4794cCEd47d3baf7370CcC43B560D3a1beEFA";
          const contract = new ethers.Contract(contractAddress, abi, Signer);
          setContract(contract);
          setProvider(provider);
        } else {
          alert("Metamask not installed");
        }
      };
      provider && loadProvider();
    } catch (error) {
      console.log(error);
    }
  }, [account, contract]);

  return (
    <Web3Context.Provider
      value={{
        account,
        setAccount,
        provider,
        setProvider,
        contract,
        setContract,
        signer,
        setSigner,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
