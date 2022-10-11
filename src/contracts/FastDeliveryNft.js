export const FastDeliveryNftAddress = '0x4626FB4C9A57B86c4204756121A897c65D592321'

export const FastDeliveryNftAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenContractAddress_",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "parcelSenderAccount",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "deliverymanAccount",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftIndex",
        "type": "uint256"
      }
    ],
    "name": "Attributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "parcelSenderAccount",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftIndex",
        "type": "uint256"
      }
    ],
    "name": "Deleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "parcelSenderAccount",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "deliverymanAccount",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftIndex",
        "type": "uint256"
      }
    ],
    "name": "Delivered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "parcelSenderAccount",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "deliverymanAccount",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftIndex",
        "type": "uint256"
      }
    ],
    "name": "InDelivery",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "parcelSenderAccount",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftIndex",
        "type": "uint256"
      }
    ],
    "name": "OnLine",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deliveryId_",
        "type": "uint256"
      }
    ],
    "name": "DeliveryInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum FastDeliveryNft.Status",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "parcelSender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "deliveryman",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "recipientFirstName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientLastName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientAddressX",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientAddressY",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientAddressInfo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientTel",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "recipientMail",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "deliveryAmount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "deliveryDistance",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "deliveryCode",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "onlineTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "attributionTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collectTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deliveredTimestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct FastDeliveryNft.Delivery",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deliveryId_",
        "type": "uint256"
      }
    ],
    "name": "attributeDelivery",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deliveryId_",
        "type": "uint256"
      }
    ],
    "name": "cancelDelivery",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deliveryId_",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "deliverycode_",
        "type": "bytes32"
      }
    ],
    "name": "collectDelivery",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "recipientFirstName_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientLastName_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientAddress_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientAddressX_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientAddressY_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientAddressInfo_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientTel_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipientMail_",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "deliveryAmount_",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "deliveryDistance_",
        "type": "string"
      }
    ],
    "name": "createDelivery",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deliveryId_",
        "type": "uint256"
      }
    ],
    "name": "deleteDelivery",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deliveryId_",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "deliveryCode_",
        "type": "bytes32"
      }
    ],
    "name": "delivered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getDeliveriesIdByAddress",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProfitBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "parcel_Sender_",
        "type": "address"
      }
    ],
    "name": "getUserDeliveriesAmountBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getlastId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "status",
    "outputs": [
      {
        "internalType": "enum FastDeliveryNft.Status",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
