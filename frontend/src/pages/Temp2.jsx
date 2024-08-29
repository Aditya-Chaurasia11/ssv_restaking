import React, { useEffect } from "react";

const Temp2 = () => {
  const fun = async () => {
    const url =
      "https://api.studio.thegraph.com/query/71118/ssv-network-holesky/version/latest";

    const query = `
query ClusterSnapshot {
  cluster(id: "0xfddD2b8D9aaf04FA583CCF604a2De12668200582-1-2-3-4") {
    active
    balance
    index
    lastUpdateBlockNumber
    networkFeeIndex
    validatorCount
  }
}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const responseData = await response.json();
    console.log(responseData);
  };

  useEffect(() => {
    fun();
  }, []);
  return (
    <div>
      <div>asdadadad</div>
    </div>
  );
};

export default Temp2;
