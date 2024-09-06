import React from "react";
import disMetImg from "../assets/disMethodImg.svg";
import "./distributionMethod.css";
import { useNavigate } from "react-router-dom";

const DistributionMethod = ({ data }) => {
  const navigate = useNavigate();

  const handleOnlineClick = () => {
    if (data) navigate("/upload-keystore", { state: data });
    console.log("disMethd", data);
  };

  return (
    <div className="distributionMethod_container_upper">
      <div className="distributionMethod_container">
        <div className="distributionMethod_container_header">
          <h2>Generate Validator KeyShares</h2>
          <p>
            To run a Distributed Validator you must split your validation key
            into
            <b> Key Shares</b> and distribute them across your selected
            operators to operate in your behalf.
          </p>
        </div>
        <img src={disMetImg}></img>
        <div className="distributionMethod_container_footer">
          <p>Select your preferred method to split your key:</p>
          <div className="distributionMethod_container_footer_button_container">
            <div className="distributionMethod_button_label">
              <button onClick={handleOnlineClick}>Online</button>
              <p>Bulk register enabled</p>
            </div>
            <div className="distributionMethod_button_label">
              <button>Offline</button>
              <p>Not enabled for this project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionMethod;
