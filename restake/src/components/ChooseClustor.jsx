import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./choosecluster.css";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../api/contextapi";
import { IoMdAdd } from "react-icons/io";

const ChooseClustor = ({ func, setDistMethod }) => {
  const { account, setAccount, provider, setProvider, contract, setContract } =
    useWeb3();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRow] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOperatorData, setSelectedOperatorData] = useState(null);
  const [operatorNames, setOperatorNames] = useState({});
  const [currentOperatorIds, setCurrentOperatorIds] = useState([]);
  const navigate = useNavigate();

  const handleClick = (event, operatorIds) => {
    setAnchorEl(event.currentTarget);
    setCurrentOperatorIds(operatorIds); // Set current operator IDs
    fetchOperatorNames(operatorIds);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentOperatorIds([]); // Clear current operator IDs
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  const fetchOperatorNames = async (operatorIds) => {
    const names = await Promise.all(
      operatorIds.map(async (id) => {
        const name = await getOperatorName(id);
        return name;
      })
    );
    setOperatorNames((prev) => ({
      ...prev,
      [operatorIds]: names,
    }));
  };

  const getOperatorName = async (id) => {
    try {
      const response = await axios.get(
        `https://api.ssv.network/api/v4/holesky/operators/${id}`
      );
      return response?.data?.name || "Unknown";
    } catch (error) {
      console.error(`Failed to fetch operator name for ID: ${id}`, error);
      return "Unknown";
    }
  };

  const handleLogData = () => {
    if (selectedOperatorData) {
      console.log("Selected Operator Data:", selectedOperatorData);
      func(selectedOperatorData);
      setDistMethod(true);

      // navigate("/distribution-method");
    } else {
      toast.warn(`Select atleast one cluster`, {
        position: "bottom-right",
      });
    }
  };

  const clusterNavigate = () => {
    navigate("/create-cluster");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const queryData = {
      operationName: "clusters",
      variables: {
        perPage: 500,
        offset: 0,
        filter: "account",
      },
      query: `
        query clusters($perPage: Int!, $offset: Int!, $filter: String!) {
          clusters(
            where: {or: [{id: $filter, cluster_active: true}, {owner_contains: $filter, cluster_active: true}]}
            orderBy: blockTimestamp
            orderDirection: "desc"
            first: $perPage
            skip: $offset
          ) {
            id
            owner
            operatorIds
            cluster_active
            cluster_validatorCount
            __typename
          }
        }
      `,
    };

    try {
      const response = await axios.post(
        "https://holesky.ssvscan.io/subgraph/graphql",
        queryData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response?.data?.data?.clusters || [];
      setRow(data);
      console.log(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRows(
      rows.filter(
        (row) =>
          row.id.toLowerCase().includes(query) ||
          row.owner.toLowerCase().includes(query)
      )
    );
  };

  const copyToClipboard = (owner) => {
    navigator.clipboard.writeText(owner);
    toast.success(`Copied ${owner?.slice(0, 10)}...`, {
      position: "bottom-right",
    });
  };

  return (
    <div className="chooseclustor_container_upper_conatiner">
      <div className="chooseclustor_container_upper">
        <div className="chooseclustor_container_upper_upper">
          <h2>Clusters</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={clusterNavigate}
            sx={{
              backgroundColor: "#007bff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            Create <IoMdAdd />
          </Button>
        </div>
        <TextField
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by ID or Owner"
          variant="outlined"
          // size=""
          sx={{
            // marginBottom: "1rem",
            marginTop: "30px",
            backgroundColor: "#0a2b3c",
            width: "100%",
            color: "white",
            "& .MuiInputBase-root": {
              color: "white",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#69757d",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
          }}
        />
        {/* <div className="horizontal_line"></div> */}
      </div>
      <div className="chooseclustor_container_lower">
        {filteredRows.length > 0 ? (
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              // borderRadius: "10px",
              boxShadow: "none",
              border: "1px solid #69757d",
              backgroundColor: "#0a2b3c",
            }}
          >
            <TableContainer sx={{ maxHeight: 700, color: "white" }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{
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
              >
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="center">Owner</TableCell>
                    <TableCell align="center">Operators ID</TableCell>
                    <TableCell align="center">Validators</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row) => {
                      return (
                        <TableRow
                          key={row.id}
                          align="center"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Radio
                              sx={{ color: "white" }}
                              value={row.id}
                              onChange={() => setSelectedOperatorData(row)}
                              checked={selectedOperatorData?.id === row.id}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row?.id
                              ? `${row?.id?.slice(0, 6)}...${row?.id?.slice(
                                  row?.id.length - 4,
                                  row?.id.length
                                )}`
                              : "loading..."}
                          </TableCell>
                          <TableCell align="center">
                            <div
                              className="owner_comp"
                              onClick={() => copyToClipboard(row?.owner)}
                            >
                              {row?.owner
                                ? `${row?.owner?.slice(
                                    0,
                                    6
                                  )}...${row?.owner?.slice(
                                    row?.owner.length - 4,
                                    row?.owner.length
                                  )}`
                                : "loading..."}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                class="w-4 h-4 iconify iconify--mingcute"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <g fill="none">
                                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                  <path
                                    fill="currentColor"
                                    d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z"
                                  ></path>
                                </g>
                              </svg>
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ maxWidth: "300px", overflow: "hidden" }}
                          >
                            <div
                              aria-describedby={popoverId}
                              variant="contained"
                              onClick={(e) => handleClick(e, row.operatorIds)}
                            >
                              <div className="chooseClustor_container">
                                {row?.operatorIds?.map((k) => (
                                  <div className="chooseCluOpIDs">{k}</div>
                                ))}
                              </div>
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
                                {operatorNames[currentOperatorIds]?.map(
                                  (name, index) => (
                                    <div key={index}>{name}</div>
                                  )
                                )}
                              </Typography>
                            </Popover>
                          </TableCell>
                          <TableCell align="center">
                            {row?.cluster_validatorCount}
                          </TableCell>
                          <TableCell align="center">
                            {row?.cluster_active ? (
                              <span className="green">
                                <FaCheck />
                              </span>
                            ) : (
                              <span className="red">
                                <RxCross2 />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <hr />
            <div className="chooseclustor_container_bottom">
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogData}
                sx={{
                  margin: "1rem",
                  backgroundColor: "#007bff",
                  "&:hover": {
                    backgroundColor: "#0056b3",
                  },
                }}
              >
                Log Selected Data
              </Button>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                  setRowsPerPage(+event.target.value)
                }
                sx={{
                  backgroundColor: "#0a2b3c",
                  color: "white",
                  "& .MuiTablePagination-selectLabel": {
                    color: "white",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    color: "white",
                  },
                  "& .MuiTablePagination-select": {
                    color: "white",
                  },
                  "& .MuiTablePagination-actions": {
                    color: "white",
                  },
                }}
              />
            </div>
          </Paper>
        ) : (
          <div className="choose_clustor_noCluster">
            You have no cluster click on create button to create clucter
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseClustor;
