import React from 'react'
import Dapp from './component/Dapp'
import { useContract } from 'web3-hooks'
import { DaidTokenAddress, DaidTokenAbi } from './contracts/DaidToken'
import { FaucetAddress, FaucetAbi } from './contracts/Faucet'
import { FastDeliveryNftAddress, FastDeliveryNftAbi } from './contracts/FastDeliveryNft'
import { FastDeliveryUserAddress, FastDeliveryUserAbi } from './contracts/FastDeliveryUser'



export const DaidTokenContext = React.createContext(null)
export const FaucetContext = React.createContext(null)
export const IcoContext = React.createContext(null)
export const FastDeliveryNftContext = React.createContext(null)
export const FastDeliveryUserContext = React.createContext(null)


function App() {
  const daidToken = useContract(DaidTokenAddress, DaidTokenAbi)
  const faucet = useContract(FaucetAddress, FaucetAbi)
  const fastDeliveryNft = useContract(FastDeliveryNftAddress, FastDeliveryNftAbi)
  const fastDeliveryUser = useContract(FastDeliveryUserAddress, FastDeliveryUserAbi)
  return (
    <FastDeliveryUserContext.Provider value={fastDeliveryUser}>
      <DaidTokenContext.Provider value={daidToken}>
        <FaucetContext.Provider value={faucet}>
          <FastDeliveryNftContext.Provider value={fastDeliveryNft}>
            <Dapp />
          </FastDeliveryNftContext.Provider>
        </FaucetContext.Provider>
      </DaidTokenContext.Provider>
    </FastDeliveryUserContext.Provider>
  )
}

export default App;