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
import erc20abi from "../abi/erc20abi";
import { useNavigate } from "react-router-dom";
import { SSVKeys, KeyShares, KeySharesItem, SSVKeysException } from "ssv-keys";
import { ClusterScanner, NonceScanner } from "ssv-scanner";
import { useWeb3 } from "../api/contextapi";
import { Contract, ethers } from "ethers";

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
  const [operIds, setOperIDs] = useState([]);
  const [operatorKeys, setOperatorKeys] = useState([]);
  const [keystore, setKeyStore] = useState(null);
  const [validatorPublicKey, setValidatorPublicKey] = useState(null);
  const [keystorePassword, setKeystorePassword] = useState("");
  const [ownerAdd, setOwnerAdd] = useState("");
  const [nonce, setNonce] = useState(null);
  const [ClusterData, setClusterData] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    account,
    setAccount,
    setProvider,
    provider,
    contract,
    setContract,
    signer,
  } = useWeb3();

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

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

  useEffect(() => {
    const operatorIds = receivedData.data?.map((operator) => operator.id);
    const publicKeys = receivedData.data?.map(
      (operator) => operator.public_key
    );

    setOperIDs(operatorIds);
    setOperatorKeys(publicKeys);
    console.log(operatorIds);
    console.log(publicKeys);
  }, [receivedData]);

  const handleClick = () => {
    console.log(filesData);
    console.log(receivedData);
    getNonce();
  };

  async function main() {
    // 1. Initialize SSVKeys SDK and read the keystore file
    const ssvKeys = new SSVKeys();
    const { publicKey, privateKey } = await ssvKeys.extractKeys(
      keystore,
      keystorePassword
    );

    const operators = operatorKeys.map((operatorKey, index) => ({
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
      ownerAddress: account,
      ownerNonce: 0,
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
        ownerAddress: account,
        ownerNonce: 0,
        privateKey,
      }
    );
    const keyShares = new KeyShares();
    keyShares.add(keySharesItem);
    console.log(keyShares.toJson());
    const keysharesData = JSON.parse(keyShares.toJson());
    console.log(keysharesData);

    // console.log(keysharesData.shares[0]?.payload.publicKey);

    try {
      const SSVToken = new Contract(
        "0xad45A78180961079BFaeEe349704F411dfF947C6",
        erc20abi,
        signer
      );
      // console.log(SSVToken);
      // console.log("erc20abi", erc20abi);

      const tx = await SSVToken.approve(
        "0x38A4794cCEd47d3baf7370CcC43B560D3a1beEFA",
        BigInt(receivedData?.number) * 10n ** 18n
      );
      console.log(tx);
      await tx.wait();
      setOpen(true);
      console.log([
        keysharesData.shares[0]?.payload.publicKey,
        operIds,
        keysharesData.shares[0]?.payload.sharesData,
        BigInt(receivedData?.number) * 10n ** 18n,
        [BigInt(0), BigInt(0), BigInt(0), Boolean(true), BigInt(0)],
      ]);

      const result = await contract?.registerValidator(
        keysharesData.shares[0]?.payload.publicKey,
        operIds,
        keysharesData.shares[0]?.payload.sharesData,
        BigInt(receivedData?.number) * 10n ** 18n,
        [BigInt(0), BigInt(0), BigInt(0), Boolean(true), BigInt(0)]
      );
      console.log(result);
    } catch (error) {
      console.error("Transaction simulation failed:", error);
    }
  }

  const getNonce = async () => {
    try {
      const params = {
        nodeUrl:
          "https://eth-holesky.g.alchemy.com/v2/_3FNJQGN_c0K-gLsSMfS56ExoqJKWmbr",
        contractAddress: "0x352A18AEe90cdcd825d1E37d9939dCA86C00e281",
        ownerAddress: account,
        operatorIds: operIds,
        network: "holesky",
      };

      // const getdata = await axios.get(
      //   `https://api.ssv.network/api/v4/holesky/clusters/owner/${account}/operators/${operIds}`
      // );
      // console.log("aa", getdata);

      // setClusterData(getdata?.data.cluster);

      if (receivedData) {
        const nonceScanner = new NonceScanner(params);
        const nextNonce = await nonceScanner.run();
        setNonce(nextNonce);
        console.log(nextNonce);

        if (nextNonce && operatorKeys && filesData.length > 0) {
          if (filesData[0]?.password) void main();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-[70px] pb-[50px]">
      <div className="bg-[#0a2b3c] shadow rounded-lg w-1/2 px-5 pt-3 pb-5">
        <div className="pb-[8px] border-b border-[#e0e0e0]">
          <h2 className="text-white text-[17px] font-[600]">
            Enter KeyShares File
          </h2>
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
              {" New Cluster Created check it on SSVScan "}
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
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
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
                        borderColor: "white",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      color: "white",
                      borderColor: "white",
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
