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
import Button from "@mui/material/Button";
import noImg from "../../assets/image.png";
import { useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

// import PopoverContainer from "@idui/react-popover";

const ChooseOperator = () => {
  const [selectedNumber, setSelectedNumber] = useState(4);
  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState(Array(4).fill(null));
  const [totalSelectedFee, setSelectedFee] = useState(0.0);
  const [upKeyStore, setUpKeyStore] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [num, setNum] = useState();

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentOperatorIds([]); // Clear current operator IDs
  };

  const handleClick = (event, operatorIds) => {
    setAnchorEl(event.currentTarget);
    setCurrentOperatorIds(operatorIds); // Set current operator IDs
    fetchOperatorNames(operatorIds);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await axios.get(
      `https://api.ssv.network/api/v4/holesky/operators?ordering=id:asc&page=1&perPage=180&ts=1724440838028`
    );
    console.log(data?.data.operators);
    setLeftData(data?.data.operators);
  };

  const handleButtonClick = (number) => {
    setSelectedNumber(number);
    setRightData(Array(number).fill(null));
  };

  const handleCheckboxToggle = (item) => {
    const updatedRightData = [...rightData];
    const itemIndexInRight = updatedRightData.findIndex(
      (data) => data && data.id === item.id
    );

    if (itemIndexInRight !== -1) {
      updatedRightData[itemIndexInRight] = null;
    } else {
      const emptyIndex = updatedRightData.indexOf(null);
      if (emptyIndex !== -1) {
        updatedRightData[emptyIndex] = item;
      } else {
        alert("No more space available");
        return;
      }
    }

    setRightData(updatedRightData);
    updateTotalFee(updatedRightData);
  };

  const handleSelectedOperator = () => {
    console.log("Logged Data:", rightData);
    navigate("/create-cluster/upload-keystore", {
      state: {
        number: num,
        data: rightData,
      },
    });
  };

  const countSelected = () => {
    return rightData.filter((data) => data !== null).length;
  };

  const calculateTotalFee = (selectedData) => {
    return selectedData.reduce((total, item) => {
      if (item) {
        return (
          total + Number((BigInt(item.fee || 0) * 100n) / 382640000000n) / 100
        );
      }
      return total;
    }, 0);
  };

  const updateTotalFee = (selectedData) => {
    const totalFee = calculateTotalFee(selectedData);
    setSelectedFee(totalFee.toFixed(2));
  };

  return (
    <div>
      <div className="chooseOperator_container">
        <div className="left-side">
          <div className="left-side_header">
            <div className="left_side_heading">
              <h2>
                Pick the cluster of network operators to run your validator
              </h2>
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
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 510,
                // backgroundColor: "#0b2a3c",
                boxShadow: "none",
                border: "1px solid #69757d",
                backgroundColor: "gray",
              }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  color: "white",
                  "& .MuiTableCell-root": {
                    color: "white",
                    backgroundColor: "#0a2b3c",
                  },
                  "& .MuiTableRow-root": {
                    color: "#6c757d",
                  },
                  "& .MuiTableHead-root": {
                    color: "#6c757d",
                  },
                  "& .MuiTableBody-root": {
                    color: "#6c757d",
                  },
                }}
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
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Checkbox
                          type="checkbox"
                          disabled={row?.is_private || row?.is_active === 0}
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 },
                            color: "white",
                          }}
                          checked={rightData.some(
                            (data) => data && data.id === row.id
                          )}
                          onChange={() => handleCheckboxToggle(row)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <div className="choose_operator_row_container">
                          <img src={row.logo ? row?.logo : noImg}></img>
                          <div className="choose_operator_row_container_data">
                            <h2>{row.name}</h2>
                            <p> ID : {row?.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        {row?.validators_count}
                      </TableCell>
                      <TableCell align="center">
                        {row?.performance["30d"]?.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {(
                          Number(
                            (BigInt(row?.fee || 0) * 100n) / 382640000000n
                          ) / 100
                        ).toFixed(2)}{" "}
                        SSV
                      </TableCell>
                      <TableCell align="right">
                        {/* <PopoverContainer
                          animation={{
                            animate: {
                              opacity: 1,
                              scale: 1,
                            },
                            exit: {
                              opacity: 0,
                              scale: 0.9,
                              transition: {
                                duration: 0.1,
                              },
                            },
                            initial: {
                              opacity: 0,
                              scale: 0.9,
                            },
                          }}
                          arrowOffset={195}
                          arrowPlacement="center"
                          arrowSize={15}
                          content={`${row.mev_relays?.split(",")}`}
                          maxWidth="10"
                          offset={[0, 0]}
                          onChangeOpen={function noRefCheck() {}}
                          onFocus={function noRefCheck() {}}
                        >
                          <div className="chooseOp_mev">
                            {row.mev_relays?.split(",").length}
                          </div>
                        </PopoverContainer> */}
                        <div
                          aria-describedby={popoverId}
                          className="chooseOp_mev"
                          onClick={(e) => handleClick(e, row.mev_relays)}
                        >
                          {row.mev_relays?.split(",").length}
                        </div>
                        <Popover
                          id={popoverId}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          disableElevation
                          anchorOrigin={{
                            vertical: "center",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "center",
                            horizontal: "right",
                          }}
                          sx={{
                            "& .MuiPaper-root": {
                              boxShadow: "none",
                              backgroundColor: "#f0f0f0",
                              maxWidth: 300,
                            },
                          }}
                        >
                          <Typography sx={{ p: 2 }}>
                            {`${row.mev_relays?.split(",")}`}
                          </Typography>
                        </Popover>
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
              <span>
                {countSelected()}/{selectedNumber}
              </span>
            </h2>
          </div>
          <div className="chooseOperator_right_side_button_container">
            {rightData.map((data, index) => (
              <div key={index} className="chooseOperator_right_side_button">
                {data ? (
                  <div className="choosenOperator_right">
                    <div className="choosenOperator_right_left">
                      <img src={data.logo ? data?.logo : noImg}></img>
                      <div className="choosenOperator_right_left_data">
                        <h2>{data?.name}</h2>
                        <p>ID : {data?.id}</p>
                      </div>
                    </div>
                    <div className="choosenOperator_right_right">
                      <h2>
                        {(
                          Number(
                            (BigInt(data?.fee || 0) * 100n) / 382640000000n
                          ) / 100
                        ).toFixed(2)}{" "}
                        SSV
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="notchoosenOperator_right">
                    Select Operator
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chooseOperator_right_side_bottom_container">
            {/* <hr></hr> */}
            {/* <input placeholder="Enter number" type="number"></input> */}
            <TextField
              id="outlined-basic"
              label="Enter number"
              variant="outlined"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              sx={{
                width: "100%",
                "& .MuiInputBase-input": {
                  color: "white", // Text color
                },
                "& .MuiInputLabel-root": {
                  color: "white", // Label color
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Border color when not focused
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white", // Border color when focused
                  },
                },
              }}
            />

            <div className="chooseOperator_right_side_bottom_container_header">
              <p>Operators Yearly Fee </p>
              <h2>{totalSelectedFee} SSV</h2>
            </div>
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: "100%" }}
              onClick={handleSelectedOperator}
              disabled={countSelected() !== selectedNumber}
            >
              <h2 className="chooseOperator_right_side_bottom">Next</h2>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseOperator;
