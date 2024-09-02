import { ethers } from "ethers";
import React, { createContext, useState, useContext, useEffect } from "react";
// import thetaVidContract from "../contract/abi";

const Web3Context = createContext();

export const Web3provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const abi = [
    {
      inputs: [
        {
          internalType: "bytes",
          name: "publicKey",
          type: "bytes",
        },
        {
          internalType: "uint64[]",
          name: "operatorIds",
          type: "uint64[]",
        },
        {
          internalType: "bytes",
          name: "sharesData",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "uint32",
              name: "validatorCount",
              type: "uint32",
            },
            {
              internalType: "uint64",
              name: "networkFeeIndex",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "index",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
          ],
          internalType: "struct ISSVNetworkCore.Cluster",
          name: "cluster",
          type: "tuple",
        },
      ],
      name: "registerValidator",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
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
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          // Check if the current network is theta (chainId: 0x16d)
        //   const network = await provider.getNetwork();

          setAccount(address);
          // let contractAddress = "0x7fe89C4112BEF0E3CCDf71D77EC8cEb259fFCBA3";
          let contractAddress = "0x38A4794cCEd47d3baf7370CcC43B560D3a1beEFA";

          const contract = new ethers.Contract(contractAddress, abi, signer);

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
