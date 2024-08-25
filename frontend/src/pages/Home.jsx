import React, { useState } from "react";
import DragComponent from "../components/DragDrop/DragComponent";
import ChooseOperator from "../components/Choose Operator/ChooseOperator";
import JoinCard from "../components/JoinCard";
import DistributeValidator from "../components/distributeValidator";

const Home = () => {
  return (
    <div>
      <div>
        {/* <ChooseOperator /> */}
        {/* <DragComponent /> */}
        <JoinCard />
        {/* <DistributeValidator/> */}
      </div>
    </div>
  );
};

export default Home;
