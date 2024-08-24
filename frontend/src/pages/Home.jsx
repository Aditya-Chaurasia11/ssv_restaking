import React from "react";
import DragComponent from "../components/DragDrop/DragComponent";
import ChooseOperator from "../components/Choose Operator/ChooseOperator";

const Home = () => {
  return (
    <div>
      <div>
        <ChooseOperator/>
        <DragComponent/>

      </div>
    </div>
  );
};

export default Home;
