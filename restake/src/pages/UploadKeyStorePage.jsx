import { CustomDragDrop } from "../components/CustomContainer";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SSVKeys, KeyShares, KeySharesItem, SSVKeysException } from "ssv-keys";
import { ClusterScanner, NonceScanner } from "ssv-scanner";
import { useWeb3 } from "../api/contextapi";

export default function DragComponent() {
  const location = useLocation();
  const receivedData = location.state;
  const navigate = useNavigate();
  const [filesData, setFilesData] = useState([]);
  const [operatorKey, setOperatorKey] = useState([]);
  const [operIds, setOperIDs] = useState([]);
  // const [operatorKeys, setOperatorKeys] = useState([]);
  const [keystore, setKeyStore] = useState(null);
  const [validatorPublicKey, setValidatorPublicKey] = useState(null);
  const [keystorePassword, setKeystorePassword] = useState("");
  const [ownerAdd, setOwnerAdd] = useState("");
  const [nonce, setNonce] = useState(null);
  const [ClusterData, setClusterData] = useState(null);

  const { account, setAccount, provider, setProvider, contract, setContract } =
    useWeb3();

  const uploadFiles = (files) => {
    const newFilesData = files.map((file) => ({
      file: file,
      password: "",
      showPassword: false,
    }));
    const updatedFilesData = [...newFilesData, ...filesData];

    if (updatedFilesData.length > 0) {
      const jsonContent = JSON.parse(updatedFilesData[0]?.file.content);
      setValidatorPublicKey(jsonContent.pubkey);
      // console.log(jsonContent.pubkey);

      // console.log(JSON.stringify(jsonContent, null, 2));
      if (jsonContent) {
        setKeyStore(JSON.stringify(jsonContent, null, 2));
      }
    }
    // console.log(updatedFilesData);
    setFilesData(updatedFilesData);
  };

  const deleteFile = (index) => {
    setFilesData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, value) => {
    const updatedFilesData = [...filesData];
    updatedFilesData[index].password = value;
    setFilesData(updatedFilesData);

    if (index === 0) {
      setKeystorePassword(updatedFilesData[0]?.password);
    }
  };

  const handleClickShowPassword = (index) => {
    const updatedFilesData = [...filesData];
    updatedFilesData[index].showPassword =
      !updatedFilesData[index].showPassword;
    setFilesData(updatedFilesData);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function main() {
    // 1. Initialize SSVKeys SDK and read the keystore file
    const ssvKeys = new SSVKeys();
    const { publicKey, privateKey } = await ssvKeys.extractKeys(
      keystore,
      keystorePassword
    );

    const operators = operatorKey.map((operatorKey, index) => ({
      id: operIds[index],
      operatorKey,
    }));

    // 2. Build shares from operator IDs and public keys
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    const keySharesItem = new KeySharesItem();
    //   // console.log(keySharesItem.toJson()); // Log the data to the console
    await keySharesItem.update({ operators });
    //   // console.log(keySharesItem.toJson()); // Log the data to the console again after update

    await keySharesItem.update({
      ownerAddress: ownerAdd,
      ownerNonce: nonce,
      publicKey,
    });
    //   // console.log(keySharesItem.toJson()); // Log updated data

    // 3. Build final web3 transaction payload and update keyshares file with payload data
    await keySharesItem.buildPayload(
      {
        publicKey,
        operators,
        encryptedShares,
      },
      {
        ownerAddress: ownerAdd,
        ownerNonce: nonce,
        privateKey,
      }
    );

    const keyShares = new KeyShares();
    keyShares.add(keySharesItem);
    // Log the final key shares data instead of saving to a file
    console.log(keyShares.toJson());
    const keysharesData = JSON.parse(keyShares.toJson());
    console.log(
      "keysharesData?.shares[0].payload",
      keysharesData?.shares[0].payload
    );

    // testing write function

    console.log("getting data in coonect ", ClusterData);

    console.log("getting data while wagmi integration", [
      keysharesData.shares[0]?.payload.publicKey,
      operIds,
      keysharesData.shares[0]?.payload.sharesData,
      0,
      ClusterData?.validatorCount,
      ClusterData?.networkFeeIndex,
      ClusterData?.index,
      Boolean(ClusterData?.active),
      ClusterData?.balance,
    ]);

    // try {
    // console.log("wagmi integration flag1");
    // const connector = getConnectorClient();
    // if (!connector?.isConnected) {
    //   await connector?.connect();
    // }

    // const getConn = await connect(config, {
    //   chainId: holesky.id,
    //   connector: injected(),
    // });
    // console.log(getConn);

    // if (getConn.accounts[0]) {
    try {
      const result = await contract?.registerValidator(
        keysharesData.shares[0]?.payload.publicKey,
        operIds,
        keysharesData.shares[0]?.payload.sharesData,
        0,
        [
          ClusterData?.validatorCount,
          Number(ClusterData?.networkFeeIndex),
          Number(ClusterData?.index),
          Boolean(ClusterData?.active),
          Number(ClusterData?.balance),
        ]
      );
      console.log(result);
    } catch (error) {
      console.error("Transaction simulation failed:", error);
    }

    // }

    console.log("wagmi integration flag2");

    // console.log("write contract", result);
    // } catch (error) {
    //   console.log("getting error while wagmi integration", error);
    // }
    // console.log("done");
  }

  const getNonce = async () => {
    try {
      const params = {
        nodeUrl:
          "https://eth-holesky.g.alchemy.com/v2/_3FNJQGN_c0K-gLsSMfS56ExoqJKWmbr", // this can be an Infura, or Alchemy node, necessary to query the blockchain
        contractAddress: "0x352A18AEe90cdcd825d1E37d9939dCA86C00e281", // this is the address of SSV smart contract
        ownerAddress: receivedData?.owner, // this is the wallet address of the cluster owner
        operatorIds: receivedData?.operatorIds, // this is a list of operator IDs chosen by the owner for their cluster
        network: "holesky",
      };

      const getdata = await axios.get(
        `https://api.ssv.network/api/v4/holesky/clusters/owner/${receivedData?.owner}/operators/${receivedData?.operatorIds}`
      );
      console.log("getdata", getdata?.data.cluster);

      // ClusterScanner is initialized with the given parameters
      // const clusterScanner = new ClusterScanner(params);
      // // Return the Cluster Snapshot
      // const result = await clusterScanner.run(receivedData?.operatorIds);
      setClusterData(getdata?.data.cluster);
      // console.log("cluster data", result.cluster);
      // console.log("cluster data result", result);

      if (receivedData) {
        console.log(params);

        const nonceScanner = new NonceScanner(params);
        // Return the owner nonce
        const nextNonce = await nonceScanner.run();
        // console.log("asdasdafaf");

        // console.log("Next Nonce:", nextNonce);
        setNonce(nextNonce);
      } else {
        // console.log("no data gett");
      }
    } catch (error) {
      // console.log("getting error to get nonce", error);
    }
  };

  useEffect(() => {
    console.log("contract", contract);

    getNonce();
  }, [receivedData]);

  const handleClick = () => {
    // console.log(filesData);
    if (nonce && operatorKey && filesData.length > 0) {
      if (filesData[0]?.password) void main();
    }
  };

  const getOperatorKeys = async () => {
    setOperIDs(receivedData?.operatorIds);
    setOwnerAdd(receivedData?.owner);
    try {
      const array = [];
      for (const id of receivedData?.operatorIds) {
        const response = await axios.get(
          `https://api.ssv.network/api/v4/holesky/operators/${id}`
        );
        array.push(response.data.public_key);
      }
      setOperatorKey(array);
      // console.log(array);
    } catch (error) {
      console.error("Error fetching operator data:", error);
    }
  };

  useEffect(() => {
    // console.log("drag", receivedData);
    getOperatorKeys();
  }, [receivedData]);

  return (
    <div className="flex items-center justify-center mt-[70px] pb-[50px]">
      <div className="bg-[#0a2b3c] shadow rounded-lg w-1/2 px-5 pt-3 pb-5">
        <div className="pb-[8px] border-b border-[#e0e0e0]">
          <h2 className="text-white text-[17px] font-[600]">
            Enter KeyShares File
          </h2>
        </div>
        <CustomDragDrop
          ownerLicense={filesData.map((data) => data.file)}
          onUpload={uploadFiles}
          onDelete={deleteFile}
          formats={["json"]}
        />
        {filesData.length > 0 && (
          <div className="mt-4 space-y-2">
            <h2 className="text-[#97a5ba] text-[16px] font-[500] mt-[30px] mb-[1px]">
              Keystore Password
            </h2>
            {filesData.map((data, index) => (
              <div key={index}>
                <FormControl
                  sx={{
                    mt: "5px",
                    mb: "px",
                    width: "100%",
                  }}
                  variant="outlined"
                >
                  <InputLabel
                    htmlFor={`outlined-adornment-password-${index}`}
                    sx={{ color: "white" }}
                  >
                    {`Enter keystore password for file ${index + 1}`}
                  </InputLabel>
                  <OutlinedInput
                    id={`outlined-adornment-password-${index}`}
                    type={data.showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword(index)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: "white" }}
                        >
                          {data.showPassword ? (
                            <Visibility sx={{ color: "white" }} />
                          ) : (
                            <VisibilityOff sx={{ color: "white" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={`Enter keystore password for file ${index + 1}`}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      color: "white",
                    }}
                  />
                </FormControl>
              </div>
            ))}
            <button
              className="w-full text-[19px] bg-blue-500 text-white px-5 py-3 rounded"
              onClick={handleClick}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
