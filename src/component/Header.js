import {
  Text,
  Flex
} from '@chakra-ui/react'

import MetaMaskParameters from './MetaMaskParameters'
import User from './User'

function Header() {
  return (
    <Flex as="header" bg="black" py="1" px="1" justify="space-between" >
      <MetaMaskParameters />
      <Text px="2" align="center" fontSize="4xl" color="white" > Fast Delivery</Text>
      <User />
    </Flex>
  )
}

export default Header