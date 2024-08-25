import React from "react";
import "./joinCard.css";
import { useNavigate } from "react-router-dom";

const JoinCard = () => {
  const navigate = useNavigate();

  const handleValidator = () => {
    navigate("/join/validator");
  };

  return (
    <div className="joincard_container">
      <div className="joincard_container_header">
        <h2>Join the SSV Network</h2>
        <p>
          Distribute your validator to run on the SSV network or help maintain
          it as one of its operators
        </p>
      </div>
      <div className="joincard_container_button_container">
        <button onClick={handleValidator}>Distribute Validator</button>
        <button>Join as Operator</button>
      </div>
    </div>
  );
};

export default JoinCard;
