import { useContext, useEffect, useState } from 'react'
// import { ethers } from 'ethers'
import { Web3Context } from 'web3-hooks'
import {
  Box,
  Center,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'

import { FaucetContext } from '../App'

function GetTokens() {
  const [web3State] = useContext(Web3Context)
  const faucet = useContext(FaucetContext)
  const [delay, setDelay] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [faucetCounter, setFaucetCounter] = useState(0)
  const toast = useToast()

  const handleClickGrabTokens = async () => {
    try {
      setIsLoading(true)
      let tx = await faucet.grabTokens()
      await tx.wait()
      setFaucetCounter(faucetCounter + 1)
      toast({
        title: 'Confirmed transaction',
        description: `Tokens for faucet offer have been credited to your balance\nTransaction hash: ${tx.hash}`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (e) {
      if (e.code) {
        toast({
          title: 'Transaction signature denied',
          description: e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (faucet) {

      const GetDelay = async () => {
        try {
          setIsLoading(true)
          const delay = await faucet.faucetDelayOf(web3State.account)
          Number(delay) === 0 ? setDelay('Now') : setDelay((new Date(Number(delay) * 1000)).toLocaleString())
        } catch (e) {
          if (e.code === 4001) {
            toast({
              title: 'Transaction signature denied',
              description: e.message,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          }
          console.log(e)
        } finally {
          setIsLoading(false)
        }
      }
      GetDelay()
    }
  }, [faucet, web3State.account, toast, faucetCounter])

  return (
    <Flex flexDirection="column" alignItems="center" m="2" >
      <Center border="1px" borderRadius="lg" borderColor="dark" bg="blue.500" w="sm" color="white" my="3" p="1">
        <Heading size="lg" >Get DAID Tokens</Heading>
      </Center>
      <Box p="3"
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="1px"
        borderRadius="lg"
        borderColor="blue"
        maxW="sm"
      >
        <VStack   >
          <Text
            as="b"
            fontSize="20"
            p="2"
            color="blue">
            10 DAID for test every day !
          </Text>
          <Button
            isLoading={isLoading}
            loadingText="Get Tokens"
            colorScheme="blue"
            onClick={handleClickGrabTokens}
            fontSize="20"
          >
            Send me test DAID Tokens
          </Button>
        </VStack>
      </Box>
      <Center pt="3" fontSize="16" borderColor="blue" w="sm" color="blue">
        Delay for next grabing tokens:
      </Center>
      <Center fontSize="16" as="b" borderRadius="lg" borderColor="blue" w="sm" color="blue">
        {delay}
      </Center>
    </Flex>
  )
}

export default GetTokens