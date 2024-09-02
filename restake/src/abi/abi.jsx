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
];

export default abi;
