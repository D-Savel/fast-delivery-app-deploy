import Header from './Header'
import Footer from './Footer'
import LandingPage from './LandingPage'
import GetTokens from './GetTokens'
import { useContext, useEffect, useState } from 'react'
import { Web3Context } from 'web3-hooks'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Link as ReachLink } from 'react-router-dom'
import {
  Box,
  Button,
  Link,
  Center,
  VStack,
  HStack,
} from '@chakra-ui/react'
import CreateUser from './CreateUser'
import { DaidTokenContext } from '../App'

function Dapp() {
  const [web3State, login] = useContext(Web3Context)
  const daidToken = useContext(DaidTokenContext)
  const [setIsLoading] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [deliveryBalance, setDeliveryBalance] = useState(0)

  useEffect(() => {
    if (daidToken) {
      const getTokenBalance = async () => {
        try {
          console.log('useEffect USER')
          setIsLoading(true)
          const getTokenBalance = await daidToken.balanceOf(web3State.account)
          setTokenBalance(Number(getTokenBalance))
        } catch (e) {
          console.log(e)
        } finally {
          setIsLoading(false)
        }
      }
      const cb = (from, to, tokenId) => {
        getTokenBalance()
      }
      getTokenBalance()
      const userFilter = daidToken.filters.Transfer(null, web3State.account)
      // ecouter sur l'event DataSet avec le filter eveFilter appliqué
      daidToken.on(userFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        daidToken.off(userFilter, cb)
      }
    }
  }, [setTokenBalance, setIsLoading, daidToken, web3State.account])

  return (
    <>
      <Router>
        <Box position="sticky" w="100%" top="0" zIndex="sticky">
          <HStack as="nav" bg="gray.300" py="1">
            <Link as={ReachLink} to={'/CreateUser'} ml="2" px="5"> My account </Link>
            <Link as={ReachLink} to={'/LandingPage'} px="5">Landing Page</Link>
            <Link as={ReachLink} to={'/GetTokens'} px="5">Get Token(s)</Link>
          </HStack>
          <Header tokenBalance={tokenBalance} setTokenBalance={setTokenBalance} deliveryBalance={deliveryBalance} setDeliveryBalance={setDeliveryBalance} />
        </Box>
        <VStack pb="20">
          {!web3State.isLogged ?
            <>
              <Center px="2" mt="10" mb="5" w="75%" py="12" bg="red.500" fontSize="20" color="white">Vous devez vous connecter à MetaMask sur le TestNet Kovan</Center>
              {!web3State.isLogged && (<Button colorScheme="orange" onClick={login}>login MetaMask
              </Button>)}
            </> :
            <>
              <Switch>
                <Route exact path='/' component={CreateUser} />
                <Route
                  path='/LandingPage'
                  component={() => <LandingPage tokenBalance={tokenBalance} setTokenBalance={setTokenBalance} />} />
                <Route path='/GetTokens' component={GetTokens} />
                <Route path='/' component={CreateUser} />

              </Switch>
            </>
          }
        </VStack>
      </Router>
      < Footer />
    </>
  )
}

export default Dapp