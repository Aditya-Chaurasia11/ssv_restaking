import { CustomDragDrop } from "./CustomContainer";
import { useEffect, useState } from "react";

export default function DragComponent() {
  const [ownerLicense, setOwnerLicense] = useState([]);

  const uploadFiles = (files) => {
    setOwnerLicense((prevFiles) => [...prevFiles, ...files]);
  };

  const deleteFile = (index) => {
    setOwnerLicense((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log(ownerLicense);
  }, [ownerLicense]);

  const printJsonFiles = () => {
    ownerLicense.forEach((file) => {
      // Check if the content exists and is not empty
      if (file.content) {
        try {
          // Parse the content string to JSON
          const jsonContent = JSON.parse(file.content);
          console.log(
            `Content of ${file.name}:`,
            JSON.stringify(jsonContent, null, 2)
          ); // Log formatted JSON content
        } catch (error) {
          console.error(`Error parsing JSON file ${file.name}:`, error.message);
        }
      } else {
        console.warn(`File ${file.name} has no content to parse.`);
      }
    });
  };

  return (
    <div className="bg-white shadow rounded-lg w-full px-5 pt-3 pb-5">
      <div className="pb-[8px] border-b border-[#e0e0e0]">
        <h2 className="text-black text-[17px] font-[600]">
          Drag and Drop Container
        </h2>
      </div>
      <CustomDragDrop
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        formats={["json"]}
      />
      {ownerLicense.length > 0 && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={printJsonFiles}
        >
          Print JSON Files
        </button>
      )}
    </div>
  );
}
