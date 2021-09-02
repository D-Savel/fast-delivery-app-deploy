export const FastDeliveryUserAddress = '0x71Cc2dA51F6F099b67Dbc68E2262990610B2e268'

export const FastDeliveryUserAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
            "internalType": "enum FastDeliveryUser.UserProfil",
            "name": "profil",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "userWeb3Address",
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
        "internalType": "enum FastDeliveryUser.UserProfil",
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
        "internalType": "string",
        "name": "profil_",
        "type": "string"
      },
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
    "name": "userRegister",
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
