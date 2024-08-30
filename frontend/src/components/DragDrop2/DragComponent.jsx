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

export default function DragComponent() {
  const location = useLocation();
  const receivedData = location.state;

  const [ownerLicense, setOwnerLicense] = useState([]);
  const [textValues, setTextValues] = useState([]); // State to hold the values of the text inputs
  const [showPasswords, setShowPasswords] = useState([]); // State to hold the visibility status of each input

  const uploadFiles = (files) => {
    setOwnerLicense((prevFiles) => [...prevFiles, ...files]);
    setTextValues((prevValues) => [
      ...prevValues,
      ...files.map(() => ""), // Initialize text inputs for new files
    ]);
    setShowPasswords((prevShow) => [
      ...prevShow,
      ...files.map(() => false), // Initialize visibility status for new files
    ]);
  };

  const deleteFile = (index) => {
    setOwnerLicense((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setTextValues((prevValues) => prevValues.filter((_, i) => i !== index)); // Remove corresponding text input
    setShowPasswords((prevShow) => prevShow.filter((_, i) => i !== index)); // Remove corresponding visibility status
  };

  const handleInputChange = (index, value) => {
    const updatedValues = [...textValues];
    updatedValues[index] = value;
    setTextValues(updatedValues); // Update the text input value for the specific file
  };

  const handleClickShowPassword = (index) => {
    const updatedShowPasswords = [...showPasswords];
    updatedShowPasswords[index] = !updatedShowPasswords[index];
    setShowPasswords(updatedShowPasswords); // Toggle visibility for the specific input field
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const printJsonFiles = () => {
    ownerLicense.forEach((file, index) => {
      if (file.content) {
        try {
          const jsonContent = JSON.parse(file.content);
          console.log(
            `Content of ${file.name}:`,
            JSON.stringify(jsonContent, null, 2)
          );
          console.log(`Associated input value: ${textValues[index]}`); // Log the corresponding text input value
        } catch (error) {
          console.error(`Error parsing JSON file ${file.name}:`, error.message);
        }
      } else {
        console.warn(`File ${file.name} has no content to parse.`);
      }
    });
  };

  useEffect(() => {
    console.log("drag", receivedData);
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
          ownerLicense={ownerLicense}
          onUpload={uploadFiles}
          onDelete={deleteFile}
          formats={["json"]}
        />
        {ownerLicense.length > 0 && (
          <div className="mt-4 space-y-2">
            <h2 className="text-[#97a5ba] text-[16px] font-[500] mt-[30px] mb-[1px]">
              Keystore Password
            </h2>
            {ownerLicense.map((_, index) => (
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
                    type={showPasswords[index] ? "text" : "password"}
                    value={textValues[index]}
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
                          {showPasswords[index] ? (
                            <VisibilityOff sx={{ color: "white" }} />
                          ) : (
                            <Visibility sx={{ color: "white" }} />
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
