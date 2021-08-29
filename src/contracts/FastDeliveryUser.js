export const FastDeliveryUserAddress = '0x810aBb21901a75aB173E57fF9Cf1222bb8bd0B2C'

export const FastDeliveryUserAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "firstName_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "lastName_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressDeliveryman_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressXDeliveryman_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressYDeliveryman_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "companySiren_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressInfo_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tel_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "mail_",
        "type": "string"
      }
    ],
    "name": "deliverymanRegister",
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
        "name": "userAddress_",
        "type": "address"
      }
    ],
    "name": "getUserInfo",
    "outputs": [
      {
        "components": [
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
            "name": "firstName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "lastName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "userAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "addressX",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "addressY",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "companySiren",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "addressInfo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tel",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "mail",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "registerTimestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct FastDeliveryUser.User",
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
        "name": "userAddress_",
        "type": "address"
      }
    ],
    "name": "getUserType",
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
        "internalType": "string",
        "name": "firstName_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "lastName_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressParcelSender_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressXParcelSender_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressYParcelSender_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addressInfo_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tel_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "mail_",
        "type": "string"
      }
    ],
    "name": "parcelSenderRegister",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
