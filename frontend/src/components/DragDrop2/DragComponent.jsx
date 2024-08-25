import { CustomDragDrop } from "./CustomContainer";
import { useEffect, useState } from "react";

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

  return (
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
            <input
              key={index}
              type="text"
              value={textValues[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              placeholder={`Enter keystore password for ${index + 1}`}
            />
          ))}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={printJsonFiles}
          >
            Print JSON Files
          </button>
        </div>
      )}
    </div>
  );
}
