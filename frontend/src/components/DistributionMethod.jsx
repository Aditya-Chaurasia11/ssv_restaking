import React from "react";
import disMetImg from "../assets/disMethodImg.svg";
import "./distributionMethod.css";

const DistributionMethod = () => {
  return (
    <div className="distributionMethod_container">
      <div className="distributionMethod_container_header">
        <h2>Generate Validator KeyShares</h2>
        <p>
          To run a Distributed Validator you must split your validation key into
          <b> Key Shares</b> and distribute them across your selected operators
          to operate in your behalf.
        </p>
      </div>
      <img src={disMetImg}></img>
      <div className="distributionMethod_container_footer">
        <p>Select your preferred method to split your key:</p>
        <div className="distributionMethod_container_footer_button_container">
          <button>Online</button>
          <button>Offline</button>
        </div>
      </div>
    </div>
  );
};

export default DistributionMethod;
