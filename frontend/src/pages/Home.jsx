import React, { useState } from "react";
import DragComponent from "../components/DragDrop2/DragComponent";
import ChooseOperator from "../components/Choose Operator/ChooseOperator";
import JoinCard from "../components/JoinCard";
import DistributeValidator from "../components/distributeValidator";
import DistributionMethod from "../components/distributionMethod";

const Home = () => {
  return (
    <div>
      <div>
        {/* <ChooseOperator /> */}
        {/* <DragComponent /> */}
        <JoinCard />
        {/* <DistributeValidator/> */}
        {/* <DistributionMethod/> */}
      </div>
    </div>
  );
};

export default Home;
