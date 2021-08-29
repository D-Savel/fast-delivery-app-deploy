import {
  Center,
  Text,
  Box
} from '@chakra-ui/react'

function Footer() {
  return (
    <Box position="fixed" bottom="0" bg="black" color="white" py="2" h="auto" w="100%">
      <Center >
        <Text as="a" href="https://github.com/AbsoluteVirtueXI/web3-hooks" >Made for Alyra project with web3-hooks library</Text>
      </Center>
    </Box>
  )
}
export default Footer