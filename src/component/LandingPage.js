import { useContext, useEffect, useState } from 'react'
import CreateUser from './CreateUser'
import ParcelSenderBoard from './ParcelSenderBoard'
import DeliverymanBoard from './DeliverymanBoard'
import { FastDeliveryUserContext } from '../App'
import { Web3Context } from 'web3-hooks'

function LandingPage(props) {
  const { userAddress, setUserAddress, userProfil, setUserProfil } = props
  const [selectedId, setSelectedId] = useState()
  const [web3State] = useContext(Web3Context)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)

  useEffect(() => {
    if (fastDeliveryUser) {
      const getUserType = async () => {
        try {
          const userType = await fastDeliveryUser.getUserType(web3State.account)
          if (userType === 0) { setUserProfil("0") }
          if (userType === 1) { setUserProfil("parcelSender") }
          if (userType === 2) { setUserProfil("deliveryman") }
        } catch (e) {
          console.log(e)
        }
      }
      getUserType()
    }
  }, [fastDeliveryUser, setUserProfil, web3State.account])

  return (
    <>
      {userProfil === 'parcelSender' && (<ParcelSenderBoard selectedId={selectedId} setSelectedId={setSelectedId} />)}
      {userProfil === 'deliveryman' && (<DeliverymanBoard selectedId={selectedId} setSelectedId={setSelectedId} />)}
      {userProfil === '0' && (<CreateUser userAddress={userAddress} setUserAddress={setUserAddress} userProfil={userProfil} setUserProfil={setUserProfil} />)}
    </>
  )
}

export default LandingPage