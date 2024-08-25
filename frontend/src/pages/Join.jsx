import React, { useState } from "react";
import DragComponent from "../components/DragDrop2/DragComponent";
import ChooseOperator from "../components/Choose Operator/ChooseOperator";
import JoinCard from "../components/JoinCard";
import DistributeValidator from "../components/distributeValidator";
import DistributionMethod from "../components/distributionMethod";
import "./join.css";

const Join = () => {
  return (
    <>
      <div className="join_container">
        <JoinCard />
      </div>
    </>
  );
};

export default Join;
