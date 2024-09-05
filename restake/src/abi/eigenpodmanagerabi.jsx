const abi = [
  {
    type: "function",
    name: "ownerToPod",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "", type: "address", internalType: "contract IEigenPod" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createPod",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
];

export default abi;
