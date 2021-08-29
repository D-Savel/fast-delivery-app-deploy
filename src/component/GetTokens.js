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
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  FormControl,
  useToast,
} from '@chakra-ui/react'

import { FaucetContext } from '../App'
import { IcoContext } from '../App'


function GetTokens() {

  const [web3State] = useContext(Web3Context)
  const faucet = useContext(FaucetContext)
  const ico = useContext(IcoContext)
  const [isLoading, setIsLoading] = useState(false)
  const [delay, setDelay] = useState('')
  const [faucetCounter, setFaucetCounter] = useState(0)
  const [price, setPrice] = useState(0)
  const [tokenAmount, setTokenAmount] = useState()
  const toast = useToast()

  const handleClickBuyTokens = async () => {
    const weiAmount = (tokenAmount * price)
    try {
      const tx = await ico.buyTokens({ value: weiAmount })
      await tx.wait()
      toast({
        title: 'Confirmed transaction',
        description: `Tokens have been credited to your balance\nTransaction hash: ${tx.hash}`,
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

  useEffect(() => {
    if (ico) {

      const GetPrice = async () => {
        try {
          setIsLoading(true)
          const Price = await ico.price()
          setPrice(Price)
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
      GetPrice()
    }
  }, [ico, toast])

  return (

    <Flex flexDirection="column" alignItems="center" m="2" >
      <Center border="1px" borderRadius="lg" borderColor="dark" bg="blue.500" w="sm" color="white" my="3" p="1">
        <Heading size="lg" >Get DAID Tokens</Heading>
      </Center>
      <Box pb="3"
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="1px"
        borderRadius="lg"
        borderColor="blue"
        w="sm"
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
      <Center fontSize="16" borderColor="blue" w="sm" color="blue">
        Delay for next grabing tokens:
      </Center>
      <Center fontSize="16" as="b" borderRadius="lg" borderColor="blue" w="sm" color="blue">
        {delay}
      </Center>
      <Center border="1px"
        borderRadius="lg"
        borderColor="blue"
        w="sm"
        mt="5"
        p="1"
        py="2">
        <VStack   >
          <Text
            as="b"
            fontSize="20"
            p="3"
            color="blue">
            {`Buy Tokens !   (1 Eth = ${1 / (price * 1e-18)} DAID)`}
          </Text>
          <FormControl isRequired>
            <InputGroup pb="3" size="sm">
              <InputLeftAddon borderRadius="lg" children="DAID" />
              <Input id="tokenAmount"
                type="number"
                borderRadius="lg"
                bg="light"
                placeholder="DAID Amount"
                onChange={(event) => setTokenAmount(Number(event.target.value))}
                isInvalid={tokenAmount === 0 || !tokenAmount ? true : false} />
              <Input value={tokenAmount === 0 || !tokenAmount ? 0 : tokenAmount / (price * 1e-18)} disabled={true} />
              <InputRightAddon borderRadius="lg" children="Ethers" />
            </InputGroup>
          </FormControl>
          <Button
            isLoading={isLoading}
            colorScheme="blue"
            onClick={handleClickBuyTokens}
            fontSize="18"
            disabled={tokenAmount === 0 || !tokenAmount ? true : false}
          >
            Buy {tokenAmount} DAID
          </Button>
        </VStack>
      </Center>
    </Flex>
  )
}

export default GetTokens