import React, { useState } from "react";
import ChooseClustor from "./ChooseClustor";
import RestakingInfoCard from "../components/RestakingInfoCard";
import DistributionMethod from "../components/distributionMethod";

const ClustorPage = () => {
  const [showDisMethod, setDistMethod] = useState(false);
  const [clustorData, setClustorData] = useState(null);

  const getCulstorData = (data) => {
    setClustorData(data);
    console.log("data", data);
  };

  return (
    <div>
      <div>
        {!showDisMethod ? (
          <ChooseClustor func={getCulstorData} setDistMethod={setDistMethod} />
        ) : (
          <DistributionMethod data={clustorData} />
        )}
      </div>
    </div>
  );
};

export default ClustorPage;
