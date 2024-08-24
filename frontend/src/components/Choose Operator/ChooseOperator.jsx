import axios from "axios";
import React, { useEffect, useState } from "react";
import "./chooseOperator.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

const ChooseOperator = () => {
  const [selectedNumber, setSelectedNumber] = useState(4);
  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState(Array(4).fill(null));

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await axios.get(
      `https://api.ssv.network/api/v4/mainnet/operators?ordering=id:asc&page=1&perPage=80&ts=1724440838028`
    );
    console.log(data?.data.operators);
    setLeftData(data?.data.operators);
  };

  const handleButtonClick = (number) => {
    setSelectedNumber(number);
    setRightData(Array(number).fill(null)); // Reset right side fields based on selected number
  };

  const handleCheckboxToggle = (item) => {
    const updatedRightData = [...rightData];
    const itemIndexInRight = updatedRightData.findIndex(
      (data) => data && data.id === item.id
    );

    if (itemIndexInRight !== -1) {
      // If item is already in right side, remove it
      updatedRightData[itemIndexInRight] = null;
    } else {
      // If item is not in right side, add it to the first available spot
      const emptyIndex = updatedRightData.indexOf(null);
      if (emptyIndex !== -1) {
        updatedRightData[emptyIndex] = item;
      } else {
        alert("No more space available");
        return;
      }
    }

    setRightData(updatedRightData);
  };

  const handleLogData = () => {
    console.log("Logged Data:", rightData);
  };

  return (
    <div className="chooseOperator_container">
      <div className="left-side">
        <div className="left-side_header">
          <div className="left_side_heading">
            <h2>Pick the cluster of network operators to run your validator</h2>
          </div>
          <div className="left-side_button_container">
            <h3>Cluster Size</h3>
            <div className="left-side_button_coll">
              {[4, 7, 10, 13].map((num) => (
                <button
                  className={`left-side_button ${
                    selectedNumber === num
                      ? "choose_operator_button_active"
                      : ""
                  }`}
                  key={num}
                  onClick={() => handleButtonClick(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="choose_operator_datalist">
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table
              sx={{ minWidth: 650 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="center">Validators</TableCell>
                  <TableCell align="center">30d performance</TableCell>
                  <TableCell align="center">Yearly Fee</TableCell>
                  <TableCell align="center">MEV</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leftData?.map((row) => (
                  <TableRow
                    key={row.name}
                    align="center"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Checkbox
                        type="checkbox"
                        disabled={row?.is_private || row?.is_active === 0}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                        checked={rightData.some(
                          (data) => data && data.id === row.id
                        )}
                        onChange={() => handleCheckboxToggle(row)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">
                      {row?.validators_count}
                    </TableCell>
                    <TableCell align="center">
                      {row?.performance["30d"]?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {(
                        Number((BigInt(row?.fee || 0) * 100n) / 382640000000n) /
                        100
                      ).toFixed(2)}{" "}
                      SSV
                    </TableCell>
                    <TableCell align="right">
                      <div className="chooseOp_mev">
                        {row.mev_relays?.split(",").length}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="right-side_chooseOperator_container">
        <div className="right-side_header">
          <h2>Selected Operators</h2>
          <h2>
            <span>0/{selectedNumber}</span>
          </h2>
        </div>
        <div className="chooseOperator_right_side_button_container">
          {rightData.map((data, index) => (
            <div key={index} className="chooseOperator_right_side_button">
              {data ? (
                <div className="choosenOperator_right">
                  <div className="choosenOperator_right_left">
                    <img src={data?.logo}></img>
                    <div>
                      <h2>{data?.name}</h2>
                      <p>{data?.id}</p>
                    </div>
                  </div>
                  <div className="choosenOperator_right_right">
                    {(
                      Number((BigInt(data?.fee || 0) * 100n) / 382640000000n) /
                      100
                    ).toFixed(2)}{" "}
                    SSV
                  </div>
                </div>
              ) : (
                <div>Select Operator</div>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleLogData}>Log Data</button>
      </div>
    </div>
  );
};

export default ChooseOperator;