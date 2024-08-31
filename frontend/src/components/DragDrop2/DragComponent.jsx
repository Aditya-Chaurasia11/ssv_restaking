import { CustomDragDrop } from "./CustomContainer";
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

export default function DragComponent() {
  const location = useLocation();
  const receivedData = location.state;
  const navigate = useNavigate();

  const [filesData, setFilesData] = useState([]);
  const [operatorKey, setOperatorKey] = useState([]);

  const uploadFiles = (files) => {
    const newFilesData = files.map((file) => ({
      file: file,
      password: "",
      showPassword: false,
    }));
    setFilesData((prevData) => [...prevData, ...newFilesData]);
  };

  const deleteFile = (index) => {
    setFilesData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, value) => {
    const updatedFilesData = [...filesData];
    updatedFilesData[index].password = value;
    setFilesData(updatedFilesData);
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

  const printJsonFiles = () => {
    console.log(filesData);
    navigate("/temp", {
      state: { filesData, operatorKey, receivedData },
    });

    // filesData.forEach((data, index) => {
    //   const file = data.file;
    //   if (file.content) {
    //     try {
    //       const jsonContent = JSON.parse(file.content);
    //       console.log(
    //         `Content of ${file.name}:`,
    //         JSON.stringify(jsonContent, null, 2)
    //       );
    //       console.log(`Associated password: ${data.password}`);
    //     } catch (error) {
    //       console.error(`Error parsing JSON file ${file.name}:`, error.message);
    //     }
    //   } else {
    //     console.warn(`File ${file.name} has no content to parse.`);
    //   }
    // });
  };

  const operatorIds = [1, 2, 3, 4];
  const getOperatorKeys = async () => {
    try {
      const array = [];

      for (const id of operatorIds) {
        const response = await axios.get(
          `https://api.ssv.network/api/v4/holesky/operators/${id}`
        );
        array.push(response.data.public_key);
      }
      setOperatorKey(array);
      console.log(array);
    } catch (error) {
      console.error("Error fetching operator data:", error);
    }
  };

  useEffect(() => {
    console.log("drag", receivedData);
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
              onClick={printJsonFiles}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
