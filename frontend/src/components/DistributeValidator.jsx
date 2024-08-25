import React from "react";
import "./distributeValidator.css";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const DistributeValidator = () => {
  const navigate = useNavigate();

  const handleChooseValidNavigation = () => {
    navigate("/join/validator/choose-operators");
  };
  return (
    <div className="distributeValidator_upper">
      <div className="distributeValidator_container">
        <div className="distributeValidator_container_header">
          <h2>Run a Distributed Validator</h2>
          <p>
            Distribute your validation duties among a set of distributed nodes
            to improve your validator resilience, safety, liveliness, and
            diversity.
          </p>
        </div>
        <div className="distributeValidator_container_body">
          <h2>Prerequisites </h2>
          <p>
            <span>
              <FaCheck />
            </span>{" "}
            An active Ethereum validator (deposited to Beacon Chain)
          </p>
          <p>
            <span>
              <FaCheck />
            </span>{" "}
            SSV tokens to cover operational fees
          </p>
        </div>
        <div className="distributeValidator_container_button_container">
          <button
            className="distributeVal_button1"
            onClick={handleChooseValidNavigation}
          >
            Generate new key shares
          </button>
          <button className="distributeVal_button2">
            I already have key shares
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributeValidator;
