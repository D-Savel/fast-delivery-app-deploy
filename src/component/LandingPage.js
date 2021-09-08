import { useContext, useEffect } from 'react'
import CreateUser from './CreateUser'
import ParcelSenderBoard from './ParcelSenderBoard'
import { FastDeliveryUserContext } from '../App'
import { Web3Context } from 'web3-hooks'

function LandingPage(props) {
  const { userAddress, setUserAddress, userProfil, setUserProfil } = props
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
  }, [fastDeliveryUser, web3State.account, setUserProfil])

  return (
    <>
      {userProfil === 'parcelSender' && (<ParcelSenderBoard userAddress={userAddress} setUserAddress={setUserAddress} userProfil={userProfil} setUserProfil={setUserProfil} />)}
      {userProfil === 'deliveryman' && (<p> Deliveryman Page </p>)}
      {userProfil === '0' && (<CreateUser userAddress={userAddress} setUserAddress={setUserAddress} userProfil={userProfil} setUserProfil={setUserProfil} />)}
    </>
  )
}

export default LandingPage