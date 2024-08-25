import { CustomDragDrop } from "./CustomContainer";
import { useEffect, useState } from "react";
// import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function DragComponent() {
  const [ownerLicense, setOwnerLicense] = useState([]);
  const [textValues, setTextValues] = useState([]); // State to hold the values of the text inputs

  const uploadFiles = (files) => {
    setOwnerLicense((prevFiles) => [...prevFiles, ...files]);
    setTextValues((prevValues) => [
      ...prevValues,
      ...files.map(() => ""), // Initialize text inputs for new files
    ]);
  };

  const deleteFile = (index) => {
    setOwnerLicense((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setTextValues((prevValues) => prevValues.filter((_, i) => i !== index)); // Remove corresponding text input
  };

  const handleInputChange = (index, value) => {
    const updatedValues = [...textValues];
    updatedValues[index] = value;
    setTextValues(updatedValues); // Update the text input value for the specific file
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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center mt-[70px] pb-[50px]">
      <div className="bg-white shadow rounded-lg w-1/2 px-5 pt-3 pb-5">
        <div className="pb-[8px] border-b border-[#e0e0e0]">
          <h2 className="text-black text-[17px] font-[600]">
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
              <div>
                {/* <input
                key={index}
                type="password"
                value={textValues[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder={`Enter keystore password for ${index + 1}`}
              /> */}

                <FormControl
                  sx={{ mt: "5px",mb: "px", width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    {`Enter keystore password for file ${index + 1}`}
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          value={textValues[index]}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={`Enter keystore password for file ${index + 1}`}
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
