const abi= [{
    "constant": false,
    "inputs": [
        {
            "name": "_spender",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "approve",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "name": "owner",
            "type": "address"
        },
        {
            "indexed": true,
            "name": "spender",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "value",
            "type": "uint256"
        }
    ],
    "name": "Approval",
    "type": "event"
}]

export default abi;