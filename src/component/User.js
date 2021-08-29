import { useContext } from 'react'
import {
  Badge,
  Box,
  Text,
  Flex,
  VStack,
} from '@chakra-ui/react'

import { Web3Context } from 'web3-hooks'
// import { SmartWordsContext } from '../App'

function User(props) {
  const { tokenBalance, deliveryBalance } = props
  const [web3State] = useContext(Web3Context)

  return (
    <VStack py="1" align="center">
      <Box mr="1">
        <Badge maxW="sx" p="1" fontSize="13" borderRadius="md" textTransform="capitalize"> Address : {' '}
          {
            web3State.isLogged ? <Badge borderRadius="lg" fontSize="12" mx="1" px="2" variant="solid" color="white" colorScheme="blue">{web3State.account}</Badge>
              : <Badge mx="1" px="2" variant="solid" colorScheme="red">0X0000........00000</Badge>
          }
        </Badge>
      </Box>
      <Flex maxW="sx" direction="column">
        <Flex direction="row" justify="space-around" pb="2">
          <Text color="white" as="b" fontSize="17">Balance</Text>
          <Badge mx="2" py="1" fontSize="13" borderRadius="md" textTransform="capitalize">Ether(s):{' '}
            {web3State.provider ? <Badge borderRadius="lg" fontSize="13" mx="2" px="2" variant="solid" colorScheme="blue">{web3State.balance}</Badge>
              : <Badge borderRadius="lg" mx="2" py="1" px="2" variant="solid" colorScheme="red">{web3State.balance}</Badge>}
          </Badge>

        </Flex>
        <Flex direction="row" justify="space-around" pb="2">
          <Badge mx="2" py="1" fontSize="13" borderRadius="md" textTransform="capitalize">Token(s):{' '}
            {web3State.provider ? <Badge borderRadius="lg" fontSize="13" mx="2" px="2" variant="solid" colorScheme="blue">{tokenBalance} DAID</Badge>
              : <Badge borderRadius="lg" mx="2" py="1" px="2" variant="solid" colorScheme="red">{tokenBalance}</Badge>}
          </Badge>
          <Badge mx="2" py="1" fontSize="13" borderRadius="md" textTransform="capitalize">{deliveryBalance < 2 ? `Delivery : ` : `Deliveries: `}
            {web3State.provider ? <Badge borderRadius="lg" fontSize="13" mx="2" px="2" variant="solid" colorScheme="blue">{deliveryBalance}</Badge>
              : <Badge borderRadius="lg" mx="2" py="1" px="2" variant="solid" colorScheme="red">{deliveryBalance}</Badge>}
          </Badge>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default User