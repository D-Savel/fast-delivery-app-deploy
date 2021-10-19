/* eslint-disable no-useless-escape */
import { useContext, useState, useEffect } from 'react'
import {
  Input,
  List,
  ListItem,
  Flex,
  FormControl,
  FormLabel,
  Box,
  Center,
  Button,
  Heading,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react'

import axios from 'axios'
import { FastDeliveryUserContext } from '../App'
import { Web3Context } from 'web3-hooks'
require('dotenv').config();

function CreateUser(props) {
  const { userAddress, setUserAddress, userProfil, setUserProfil } = props
  const [web3State] = useContext(Web3Context)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isAdress, setIsAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const [currentProfil, setCurrentProfil] = useState(userProfil)
  const [firstRegistration, setFirstRegistration] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [addressX, setAddressX] = useState('')
  const [addressY, setAddressY] = useState('')
  const [companySiren, setCompanySiren] = useState('')
  const [addressInfo, setAddressInfo] = useState('')
  const [tel, setTel] = useState('')
  const [mail, setMail] = useState('')
  const toast = useToast()

  useEffect(() => {
    const { cancel, token } = axios.CancelToken.source();
    const urlServer = process.env.REACT_APP_URL_SERVER
    let fetchUrl = `${urlServer}/address/?address=${userAddress}`
    console.log(fetchUrl, 'Create user search')
    const request = async () => {
      setLoading(true)
      try {
        let response = await axios.get(fetchUrl, token)
        setSearchResults(response.data)
        if (response.data.length) {
          userAddress.toUpperCase().trim().localeCompare(response.data[0].adresse.trim()) === 0 ? setIsAddress(true) : setIsAddress(false)
          setAddressX(response.data[0].lon.toString())
          setAddressY(response.data[0].lat.toString())
        }
      } catch (e) {
        console.log(e.message)
      } finally {
        setLoading(false)
        if (!userAddress === "") {
          setIsAddress(false)
        }
      }
    }
    const timeOutId = setTimeout(() => request(), 500)
    return () => cancel("No longer latest query") || clearTimeout(timeOutId);
  }, [userAddress])


  const handleClickRegister = async (e) => {
    e.preventDefault()
    if (isAdress) {
      try {
        setIsLoading(true)
        let tx = await fastDeliveryUser.userRegister(currentProfil, firstName, lastName, userAddress, addressX, addressY, companySiren, addressInfo, tel, mail)
        console.log(tx)
        await tx.wait()
        toast({
          title: 'Confirmed transaction : You have been registered',
          description: `Transaction hash: ${tx.hash}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } catch (e) {
        if (e.code) {
          console.log(e.message)
          toast({
            title: 'Transaction denied',
            description: e.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
        console.log(e)
      } finally {
        setIsLoading(false)
        setFirstRegistration(false)
        setUserProfil(currentProfil)
      }
    } else {
      toast({
        title: "Error : Please enter a value for empty fields and select address",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    if (fastDeliveryUser) {
      const getUserInfo = async () => {
        try {
          const userInfo = await fastDeliveryUser.getUserInfo(web3State.account)
          if (userInfo.profil === 0) {
            setCurrentProfil("0")
            setFirstRegistration(true)
          }
          if (userInfo.profil === 1) { setCurrentProfil("parcelSender") }
          if (userInfo.profil === 2) { setCurrentProfil("deliveryman") }
          setFirstName(userInfo.firstName)
          setLastName(userInfo.lastName)
          setUserAddress(userInfo.userAddress)
          setCompanySiren(userInfo.companySiren)
          setAddressInfo(userInfo.addressInfo)
          setTel(userInfo.tel)
          setMail(userInfo.mail)
        } catch (e) {
          console.log(e)
        }
      }
      getUserInfo()
    }
  }, [fastDeliveryUser, web3State.account, setUserAddress, setCurrentProfil])


  return (

    <Flex direction="column" align="center" justify="center" m="1">
      <Center w="420px" color="blue" p="1">
        <Heading size="xl">Fast Delivery register</Heading>
      </Center>
      <Center w="420px" p="1">
        <Heading size="sm">{firstRegistration !== true && ('You are already registered with this profil !')}</Heading>
      </Center>
      <Box m="2" border="1px" borderRadius="lg" w="sm" bg="blue.500" borderColor="blue.300">
        <Box m="2" as="form">
          <FormControl isRequired>
            <FormLabel my="0" htmlFor="userProfil">User Profil</FormLabel>
            <Select
              size="sm"
              borderRadius="lg"
              bg="light"
              onChange={(event) => setCurrentProfil(event.target.value)}
              value={currentProfil}
              disabled={currentProfil !== "0" && firstRegistration !== true ? true : false}
              placeholder="Select your profil">
              <option value="parcelSender">Sender</option>
              <option value="deliveryman">Deliveryman</option>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {currentProfil !== "0" && currentProfil !== "" && (
        <VStack >
          <Box border="1px" borderRadius="lg" w="sm" bg="blue.500" borderColor="blue.300">
            <Box m="2" as="form" onSubmit={handleClickRegister}>
              <FormControl isRequired>
                <FormLabel my="0" htmlFor="firstName">{currentProfil === "parcelSender" ? 'First name' : 'Manager name'}</FormLabel>
                <Input
                  size="sm"
                  borderRadius="lg"
                  bg="light"
                  type="text"
                  placeholder="First name"
                  onChange={(event) => setFirstName(event.target.value)}
                  value={firstName}
                  isInvalid={firstName === "" ? true : false} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel pt="1" my="0" htmlFor="lastName">{currentProfil === "parcelSender" ? 'Last name' : 'Company name'}</FormLabel>
                <Input
                  size="sm"
                  borderRadius="lg"
                  bg="light"
                  type="text"
                  placeholder="Last name"
                  onChange={(event) => setLastName(event.target.value)}
                  value={lastName}
                  isInvalid={lastName === "" ? true : false} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel pt="1" my="0" htmlFor="address">{currentProfil === "parcelSender" ? 'Address' : 'Company address'}</FormLabel>
                <Input
                  size="sm"
                  borderRadius="lg"
                  bg="light"
                  type="text"
                  list="suggestionList"
                  onChange={(event) => setUserAddress(event.target.value)}
                  autoComplete="off"
                  placeholder="An address in Paris"
                  value={userAddress.toLowerCase()}
                  isInvalid={userAddress === "" || !isAdress ? true : false} />
                {
                  userAddress && !isAdress && <List as="ul"
                    fontSize="12px"
                    onClick={(event) => { setUserAddress(event.target.textContent) }}
                    p="2"
                    spacing="1"
                    bg="gray.200"
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md">
                    {loading && (<ListItem>loading...</ListItem>)}
                    {!searchResults.length && !loading && (<ListItem>No result.</ListItem>)}
                    {searchResults.length && (
                      searchResults.map((result) => {
                        return (
                          <ListItem key={result.id} _hover={{
                            background: "white",
                            fontSize: "15px",
                          }}>{result.adresse} </ListItem>
                        )
                      }
                      )
                    )
                    }
                  </List>
                }
              </FormControl>
              {currentProfil !== "parcelSender" && (<FormControl isRequired>
                <FormLabel pt="0" my="1" htmlFor="companySirenNumber">Company Siren Number</FormLabel>
                <Input
                  size="sm"
                  borderRadius="lg"
                  bg="light"
                  type="text"
                  placeholder="Siren number"
                  onChange={(event) => setCompanySiren(event.target.value)}
                  value={companySiren}
                  isInvalid={companySiren === "" ? true : false} />
              </FormControl>)
              }
              <FormControl >
                <FormLabel pt="1" my="0" htmlFor="info">Info (floor, code, door)</FormLabel>
                <Input
                  id="info"
                  size="sm"
                  borderRadius="lg"
                  bg="light"
                  type="text"
                  placeholder="Floor, code ..."
                  autoComplete="off"
                  onChange={(event) => setAddressInfo(event.target.value)}
                  value={addressInfo} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel pt="1" my="0" htmlFor="tel">Telephone</FormLabel>
                <Input
                  id="tel"
                  type="tel"
                  size="sm"
                  borderRadius="lg"
                  bg="light"
                  placeholder="Your phone number"
                  onChange={(event) => setTel(event.target.value)}
                  value={tel}
                  isInvalid={tel === "" ? true : false} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel pt="1" my="0" htmlFor="email">Mail</FormLabel>
                <Input
                  type="email"
                  id="email"
                  size="sm"
                  mb="5"
                  borderRadius="lg"
                  bg="light"
                  placeholder="bob@mail.com"
                  onChange={(event) => setMail(event.target.value)}
                  value={mail}
                  isInvalid={mail === "" ? true : false}
                />
              </FormControl>
              <Box align="center">
                <Button justify="center"
                  size="sm"
                  borderRadius="lg"
                  type="submit"
                  isLoading={isLoading}
                  colorScheme="teal"
                >
                  {firstRegistration !== true ? 'Update' : 'Register'}
                </Button>
              </Box>
            </Box>
          </Box>
        </VStack>
      )}
    </Flex>
  )
}

export default CreateUser