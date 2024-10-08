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
// import { ClusterScanner, NonceScanner } from "ssv-scanner";
import { useWeb3 } from "../api/contextapi";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DragComponent() {
  const location = useLocation();
  const receivedData = location.state;
  const navigate = useNavigate();
  const [filesData, setFilesData] = useState([]);
  const [operatorKey, setOperatorKey] = useState([]);
  const [operIds, setOperIDs] = useState([]);
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

      if (jsonContent) {
        setKeyStore(JSON.stringify(jsonContent, null, 2));
      }
    }
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

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function main() {
    const ssvKeys = new SSVKeys();
    const keySharesArray = [];

    for (let i = 0; i < filesData.length; i++) {
      const keystore = JSON.stringify(
        JSON.parse(filesData[i].file.content),
        null,
        2
      );
      const keystorePassword = filesData[i].password;

      const { publicKey, privateKey } = await ssvKeys.extractKeys(
        keystore,
        keystorePassword
      );

      const operators = operatorKey.map((operatorKey, index) => ({
        id: operIds[index],
        operatorKey,
      }));

      const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

      const keySharesItem = new KeySharesItem();
      await keySharesItem.update({ operators });
      await keySharesItem.update({
        ownerAddress: ownerAdd,
        ownerNonce: parseInt(nonce),
        publicKey,
      });

      await keySharesItem.buildPayload(
        {
          publicKey,
          operators,
          encryptedShares,
        },
        {
          ownerAddress: ownerAdd,
          ownerNonce: parseInt(nonce),
          privateKey,
        }
      );

      const keyShares = new KeyShares();
      keyShares.add(keySharesItem);

      const keysharesData = JSON.parse(keyShares.toJson());
      keySharesArray.push(keysharesData);

      console.log("keysharesData for file", i + 1, keysharesData);
    }

    if (filesData.length === 1) {
      try {
        const result = await contract?.registerValidator(
          keySharesArray[0].shares[0]?.payload.publicKey,
          operIds,
          keySharesArray[0].shares[0]?.payload.sharesData,
          0,
          [
            BigInt(ClusterData?.validatorCount),
            BigInt(ClusterData?.networkFeeIndex),
            BigInt(ClusterData?.index),
            Boolean(ClusterData?.active),
            BigInt(ClusterData?.balance),
          ]
        );
        console.log(result);
        await result.wait();

        handleClickOpen();
      } catch (error) {
        console.error("Transaction simulation failed:", error);
      }
    } else {
      // Log arrays for all files
      console.log("multiple file check");

      const publicKeys = keySharesArray.map(
        (item) => item.shares[0]?.payload.publicKey
      );
      const sharesData = keySharesArray.map(
        (item) => item.shares[0]?.payload.sharesData
      );

      console.log("Public Keys:", publicKeys);
      console.log("Shares Data:", sharesData);

      console.log("Length of filesData:", filesData.length);
      console.log("Operator IDs:", operIds);
      console.log("Cluster Data:", [
        BigInt(ClusterData?.validatorCount),
        BigInt(ClusterData?.networkFeeIndex),
        BigInt(ClusterData?.index),
        Boolean(ClusterData?.active),
        BigInt(ClusterData?.balance),
      ]);

      try {
        const result = await contract?.bulkRegisterValidator(
          publicKeys,
          operIds,
          sharesData,
          0,
          [
            BigInt(ClusterData?.validatorCount),
            BigInt(ClusterData?.networkFeeIndex),
            BigInt(ClusterData?.index),
            Boolean(ClusterData?.active),
            BigInt(ClusterData?.balance),
          ]
        );
        console.log(result);

        await result.wait();
        handleClickOpen();
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getNonce = async () => {
    try {
      const url =
        "https://api.studio.thegraph.com/query/71118/ssv-network-holesky/version/latest";
      const query = `
        query AccountNonceQuery {
          account(id: "${receivedData?.owner}") {
            nonce
          }
        }`;

      const getdata = await axios.get(
        `https://api.ssv.network/api/v4/holesky/clusters/owner/${receivedData?.owner}/operators/${receivedData?.operatorIds}`
      );
      setClusterData(getdata?.data.cluster);

      if (receivedData) {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const responseData = await response.json();
        console.log(responseData);
        console.log(responseData?.data.account.nonce);
        setNonce(responseData?.data.account.nonce);
      }
    } catch (error) {
      console.log("error in nonce scanning", error);
    }
  };

  useEffect(() => {
    getNonce();
  }, [receivedData]);

  const handleClick = () => {
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
    } catch (error) {
      console.error("Error fetching operator data:", error);
    }
  };

  useEffect(() => {
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
        {/* <Button variant="outlined" onClick={handleClickOpen}>
          Open alert dialog
        </Button> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {" All Validators are Registered Successfully "}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="dialog_box_container flex flex-col items-center justify-center"
            >
              <Button
                variant="contained"
                href="https://ssvscan.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SSVScan
              </Button>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
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
                    color: "white",
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
                        borderColor: "white", // Border color is white
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color when focused
                      },
                      color: "white", // Text color
                    }}
                  />
                </FormControl>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 bg-[#2b6e2b] rounded-md text-white w-full py-2"
          onClick={handleClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
