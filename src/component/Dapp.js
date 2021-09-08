import Header from './Header'
import Footer from './Footer'
import LandingPage from './LandingPage'
import GetTokens from './GetTokens'
import { useContext, useState } from 'react'
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

function Dapp() {
  const [web3State, login] = useContext(Web3Context)
  const [userAddress, setUserAddress] = useState('')
  const [userProfil, setUserProfil] = useState('')

  return (
    <>
      <Router>
        <Box position="sticky" w="100%" top="0" zIndex="sticky">
          <HStack as="nav" bg="gray.300" py="1">
            <Link as={ReachLink} to={'/Home'} px="5">Home</Link>
            {userProfil !== "0" && (<Link as={ReachLink} to={'/CreateUser'} ml="2" px="5"> My account </Link>)}
            <Link as={ReachLink} to={'/GetTokens'} px="5">Get Tokens</Link>
          </HStack>
          <Header />
        </Box>
        <VStack pb="10">
          {!web3State.isLogged ?
            <>
              <Center px="2" mt="10" mb="5" w="75%" py="12" bg="red.500" fontSize="20" color="white">Vous devez vous connecter à MetaMask sur le TestNet Kovan</Center>
              <Button colorScheme="orange" onClick={login}>login MetaMask</Button>
            </> :
            <Switch>
              <Route path='/Home'>
                <LandingPage userAddress={userAddress} setUserAddress={setUserAddress} userProfil={userProfil} setUserProfil={setUserProfil} />
              </Route>
              <Route path='/CreateUser'>
                <CreateUser userAddress={userAddress} setUserAddress={setUserAddress} userProfil={userProfil} setUserProfil={setUserProfil} />
              </Route>
              <Route path='/GetTokens' component={GetTokens} />
              <Route path='/'>
                <LandingPage userAddress={userAddress} setUserAddress={setUserAddress} userProfil={userProfil} setUserProfil={setUserProfil} />
              </Route>
            </Switch>
          }
        </VStack>
      </Router>
      <Footer />
    </>
  )
}
export default Dapp

