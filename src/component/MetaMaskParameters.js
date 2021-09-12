import { useContext } from 'react'
import { Web3Context } from 'web3-hooks'
import {
  Badge,
  HStack,
  VStack,
} from '@chakra-ui/react'

function MetaMaskParameters(props) {
  const [web3State] = useContext(Web3Context)

  return (
    <VStack py="1" align="start">
      <HStack align="center">
        {web3State.isLogged ? <Badge borderRadius="lg" pt="1" pr="2" px="1" textTransform="capitalize" fontSize="13" variant="solid" colorScheme="green">Id {web3State.chainId}</Badge>
          : <Badge borderRadius="lg" pt="1" pr="2" px="1" textTransform="capitalize" fontSize="13" variant="solid" colorScheme="red">not connected</Badge>
        }
        {web3State.isLogged ? <Badge borderRadius="lg" pt="1" pr="2" px="1" textTransform="capitalize" fontSize="13" variant="solid" colorScheme="green">{web3State.networkName}</Badge>
          : <Badge>{''}</Badge>
        }
      </HStack>
      {
        web3State.isLogged ? <Badge borderRadius="lg" fontSize="14" mb="1" px="1" pt="1" variant="solid" color="white" colorScheme="blue">{web3State.account.slice(0, 5)}..{web3State.account.slice(-5)}</Badge>
          : <Badge borderRadius="lg" fontSize="14" mb="1" pt="1" variant="solid" colorScheme="red">{web3State.account.slice(0, 5)}..{web3State.account.slice(-5)}</Badge>
      }
    </VStack>
  )
}

export default MetaMaskParameters