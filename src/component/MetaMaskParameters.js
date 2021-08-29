import { useContext } from 'react'
import { Web3Context } from 'web3-hooks'
import {
  Icon,
  Badge,
  Text,
  HStack,
  VStack,
} from '@chakra-ui/react'

function MetaMaskParameters() {
  const [web3State] = useContext(Web3Context)

  const CircleIcon = (props) => (
    < Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon >
  )

  return (
    <VStack spacing="10px" boxSize="auto" mx="2" justify="start" align="center">
      <HStack >
        <Text color="white" as="b" fontSize="17" me="1" p="1">MetaMask</Text>
        <Badge mx="2" px="2" py="1" fontSize="13" textTransform="capitalize" borderRadius="md"> installed
          {web3State.isMetaMask ? <CircleIcon mx="1" boxSize="4" color="green.500" />
            : <CircleIcon mx="1" boxSize="5" color="red.500" />}
        </Badge>
        <Badge mx="2" px="2" py="1" fontSize="13" textTransform="capitalize" borderRadius="md"> logged
          {web3State.isLogged ? <CircleIcon mx="1" boxSize="4" color="green.500" />
            : <CircleIcon mx="1" boxSize="5" color="red.500" />}
        </Badge>
      </HStack>
      <HStack >
        <Text color="white" as="b" fontSize="17" me="1" p="1">Network</Text>
        <Badge mx="2" px="2" fontSize="13" textTransform="capitalize" borderRadius="md">Id
          {web3State.isLogged ? <Badge borderRadius="lg" mx="2" px="2" my="1" variant="solid" colorScheme="green">{web3State.chainId}</Badge>
            : <Badge borderRadius="lg" mx="2" px="2" my="1" variant="solid" colorScheme="red">-</Badge>}
        </Badge>
        <Badge mx="2" px="2" fontSize="13" textTransform="capitalize" borderRadius="md">Name :{' '}
          {web3State.isLogged ? <Badge borderRadius="lg" mx="2" px="2" my="1" variant="solid" colorScheme="green">{web3State.networkName}</Badge>
            : <Badge borderRadius="lg" mx="2" px="2" my="1" variant="solid" colorScheme="red">{web3State.networkName}</Badge>}
        </Badge>
      </HStack>
    </VStack>
  )
}

export default MetaMaskParameters