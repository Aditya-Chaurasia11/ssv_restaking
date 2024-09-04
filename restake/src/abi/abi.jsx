const abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "publicKey",
        type: "bytes",
      },
      {
        internalType: "uint64[]",
        name: "operatorIds",
        type: "uint64[]",
      },
      {
        internalType: "bytes",
        name: "sharesData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "validatorCount",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "networkFeeIndex",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        internalType: "struct ISSVNetworkCore.Cluster",
        name: "cluster",
        type: "tuple",
      },
    ],
    name: "registerValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    type: "function",
    name: "bulkRegisterValidator",
    inputs: [
      { name: "publicKeys", type: "bytes[]", internalType: "bytes[]" },
      { name: "operatorIds", type: "uint64[]", internalType: "uint64[]" },
      { name: "sharesData", type: "bytes[]", internalType: "bytes[]" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      {
        name: "cluster",
        type: "tuple",
        internalType: "struct ISSVNetworkCore.Cluster",
        components: [
          { name: "validatorCount", type: "uint32", internalType: "uint32" },
          { name: "networkFeeIndex", type: "uint64", internalType: "uint64" },
          { name: "index", type: "uint64", internalType: "uint64" },
          { name: "active", type: "bool", internalType: "bool" },
          { name: "balance", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

export default abi;
