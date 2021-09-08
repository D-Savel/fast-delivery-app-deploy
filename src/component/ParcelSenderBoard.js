import { useRef, useContext, useState, useEffect } from 'react'
import { getDistance } from 'ol/sphere';
import {
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  Text,
  Box,
  Flex,
  List,
  ListItem,
  FormControl,
  FormLabel,
  Button,
  Heading,
  VStack,
  useToast,
  Input,
  Spacer,
  Divider
} from '@chakra-ui/react'

import axios from 'axios'
import { FastDeliveryNftContext } from '../App'
import { FastDeliveryUserContext } from '../App'
import { DaidTokenContext } from '../App'
import { Web3Context } from 'web3-hooks'
import { useIsMounted } from "../hooks/useIsMounted";

function ParcelSender() {

  const DELIVERY_PRICE = {
    _0_2: 0,
    _2_5: 2,
    _5_8: 3,
    _8_10: 4
  }
  const [web3State] = useContext(Web3Context)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)
  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const daidToken = useContext(DaidTokenContext)

  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [searchResultsSender, setSearchResultsSender] = useState([]);
  const [searchResultsRecipient, setSearchResultsRecipient] = useState([]);
  const [isSenderAddress, setIsSenderAddress] = useState(true);
  const [isRecipientAddress, setIsRecipientAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const [displayAddDelivery, setDisplayAddDelivery] = useState(false)

  const [recipientFirstName, setRecipientFirstName] = useState('')
  const [recipientLastName, setRecipientLastName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [recipientAddressX, setRecipientAddressX] = useState('')
  const [recipientAddressY, setRecipientAddressY] = useState('')
  const [recipientAddressInfo, setRecipientAddressInfo] = useState('')
  const [recipientTel, setRecipientTel] = useState('')
  const [recipientMail, setRecipientMail] = useState('')
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [deliveryDistance, setDeliveryDistance] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [deliveryTimestamp, setDeliveryTimestamp] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [deliveryStatus, setDeliveryStatus] = useState(0)

  const [senderFirstName, setSenderFirstName] = useState('')
  const [senderLastName, setSenderLastName] = useState('')
  const [senderAddress, setSenderAddress] = useState('')
  const [senderAddressX, setSenderAddressX] = useState('')
  const [senderAddressY, setSenderAddressY] = useState('')
  const [senderAddressInfo, setSenderAddressInfo] = useState('')
  const [senderTel, setSenderTel] = useState('')
  const [senderMail, setSenderMail] = useState('')

  const [deliveryIdSender, setDeliveryIdSender] = useState([])
  const [deliveriesList, setDeliveriesList] = useState([])

  const toast = useToast()
  const searchInputSender = useRef(null)
  const searchInputRecipient = useRef(null)

  useEffect(() => {
    if (fastDeliveryUser) {
      const getUserInfo = async () => {
        try {
          const userInfo = await fastDeliveryUser.getUserInfo(web3State.account)
          setSenderFirstName(userInfo.firstName)
          setSenderLastName(userInfo.lastName)
          setSenderAddress(userInfo.userAddress)
          setSenderTel(userInfo.tel)
          setSenderMail(userInfo.mail)
        } catch (e) {
          console.log(e)
        }
      }
      getUserInfo()
    }
  }, [fastDeliveryUser, web3State.account, setSenderAddress])

  useEffect(() => {
    let list = []
    let header = {
      id: "id",
      senderFirstName: "Sender",
      recipientFirstName: "Recipient",
      deliveryAmount: "Price",
      deliveryDistance: "D.(Km)",
      deliveryStatus: "Status",
      timestamp: "Date"
    }
    if (fastDeliveryNft) {
      const getDeliveriesList = async () => {
        setLoadingList(true)
        try {
          for (let id of deliveryIdSender) {
            const deliveryInfo = await fastDeliveryNft.DeliveryInfo(id)
            let timestamp = "10/08/20"
            const deliveries = {
              id: id,
              senderFirstName: senderFirstName,
              senderLastName: senderLastName,
              senderAddress: senderAddress,
              senderAddressInfo: senderAddressInfo,
              senderTel: senderTel,
              senderMail: senderMail,
              recipientFirstName: deliveryInfo.recipientFirstName,
              recipientLastName: deliveryInfo.recipientLastName,
              recipientAddress: deliveryInfo.recipientAddress,
              recipientAddressInfo: deliveryInfo.recipientAddressInfo,
              recipientTel: deliveryInfo.recipientTel,
              recipientMail: deliveryInfo.recipientMail,
              deliveryAmount: Number(deliveryInfo.deliveryAmount),
              deliveryDistance: deliveryInfo.deliveryDistance,
              deliveryStatus: deliveryInfo.status,
              timestamp: timestamp
            }
            list.push(deliveries)
          }
          list
            .reverse()
            .unshift(header)
          setDeliveriesList(list)
        } catch (e) {
          console.log(e)
        } finally {
          setLoadingList(false)
        }
      }
      getDeliveriesList()
    }
  }
    , [deliveryIdSender, fastDeliveryNft, senderAddress, senderAddressInfo, senderFirstName, senderLastName, senderMail, senderTel])

  useEffect(() => {
    if (fastDeliveryNft) {
      const getdeliveryId = async () => {
        try {
          const id = await fastDeliveryNft.getDeliveriesIdByAddress(web3State.account)
          setDeliveryIdSender([1, 2])
          console.log(id)
        } catch (e) {
          console.log(e)
        }
      }
      getdeliveryId()
    }
  }, [fastDeliveryNft, web3State.account])

  useEffect(() => {
    let url = `https://stormy-gorge-78325.herokuapp.com/address/?address=${senderAddress}`
    console.log(url, 'url Sender search')
    const request = async () => {
      setLoading(true)
      try {
        let response = await axios.get(url)
        setSearchResultsSender(response.data)
        if (response.data.length) {
          senderAddress.toUpperCase().trim().localeCompare(response.data[0].adresse.trim()) === 0 ? setIsSenderAddress(true) : setIsSenderAddress(false)
          setSenderAddressX(response.data[0].lon.toString())
          setSenderAddressY(response.data[0].lat.toString())
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    request()
  }
    , [senderAddress, isMounted])

  useEffect(() => {
    const getPrice = () => {
      if (deliveryDistance <= 2 && deliveryDistance !== 0) {
        setDeliveryPrice(DELIVERY_PRICE._0_2)
      }
      if (deliveryDistance > 2 && deliveryDistance <= 5) {
        setDeliveryPrice(DELIVERY_PRICE._2_5)
      } if (deliveryDistance > 5 && deliveryDistance <= 8) {
        setDeliveryPrice(DELIVERY_PRICE._5_8)
      }
      if (deliveryDistance > 8) {
        setDeliveryPrice(DELIVERY_PRICE._8_10)
      }
    }

    let url = `https://stormy-gorge-78325.herokuapp.com/address/?address=${recipientAddress}`
    console.log(url, 'url recipient search')
    const request = async () => {
      setLoading(true)
      try {
        let response = await axios.get(url)
        setSearchResultsRecipient(response.data)
        if (response.data.length) {
          recipientAddress.toUpperCase().trim().localeCompare(response.data[0].adresse.trim()) === 0 ? setIsRecipientAddress(true) : setIsRecipientAddress(false)
          setRecipientAddressX(response.data[0].lon.toString())
          setRecipientAddressY(response.data[0].lat.toString())
          setDeliveryDistance((Math.round((getDistance([senderAddressX, senderAddressY], [recipientAddressX, recipientAddressY]))) / 1000))
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    request()
    getPrice()
  }
    , [recipientAddress, isMounted, senderAddressX, senderAddressY, recipientAddressX, recipientAddressY, deliveryDistance, DELIVERY_PRICE._0_2, DELIVERY_PRICE._2_5, DELIVERY_PRICE._5_8, DELIVERY_PRICE._8_10])

  const handleClickAddDelivery = () => { setDisplayAddDelivery(!displayAddDelivery) }

  const handleClickApprove = async () => {
    try {
      setIsLoading(true)
      let tx = await daidToken.approve(web3State.account, 10000000000000)
      await tx.wait()
      toast({
        title: `Confirmed transaction : Token tranfer is approve for ${web3State.account}`,
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
    }
  }

  const handleClickDeliveryRegister = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.createDelivery(recipientFirstName, recipientLastName, recipientAddress, recipientAddressX, recipientAddressY, recipientAddressInfo, recipientTel, recipientMail, deliveryPrice)
      await tx.wait()
      toast({
        title: 'Confirmed transaction : Your delivery have been registered',
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
      setDisplayAddDelivery(false)
      setRecipientFirstName("")
      setRecipientLastName("")
      setRecipientAddress("")
      setRecipientAddressInfo("")
      setRecipientTel("")
      setRecipientMail("")
      setDeliveryPrice(0)
    }
  }

  return (
    <>
      <Box w="100%" px="2" pt="2" pb="5">
        <Flex>
          <Heading pl="3" size="lg">My Deliveries</Heading>
          <Spacer />
          <Box>
            <Button
              size="sm"
              type="button"
              borderRadius="lg"
              colorScheme="blue"
              onClick={handleClickAddDelivery}
            > Add new delivery</Button>
          </Box>
        </Flex>
        {loadingList &&
          <Text> Loading...</Text>
        }
        {
          !loadingList && deliveriesList.length < 1 && !displayAddDelivery &&
          <Text> You don't have any delivery registered</Text>
        }
        {
          !loadingList && deliveriesList.length > 0 && !displayAddDelivery && (
            deliveriesList.map((delivery) => {
              return (
                <Box key={delivery.id}>
                  <Flex w="100%" wrap="wrap" mt="2">
                    <Box w="25px" px="1">{delivery.id}</Box>
                    <Box minW="120px" flex="1">
                      <Popover trigger="hover" >
                        <PopoverTrigger >
                          <VStack spacing="0">
                            <Text px="1">{delivery.senderFirstName}</Text>
                            <Text px="1">{delivery.senderLastName}</Text>
                          </VStack>
                        </PopoverTrigger>
                        <PopoverContent mx="1">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>{delivery.senderFirstName}</PopoverBody>
                          <PopoverBody>{delivery.senderLastName}</PopoverBody>
                          <PopoverBody>{delivery.senderAddress}</PopoverBody>
                          <PopoverBody>{delivery.senderInfo}</PopoverBody>
                          <PopoverBody>{delivery.senderTel}</PopoverBody>
                          <PopoverBody>{delivery.senderMail}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                    <Box minW="120px" flex="1">
                      <Popover trigger="hover" >
                        <PopoverTrigger>
                          <VStack maxW="120px" spacing="0">
                            <Text px="1">R {delivery.recipientFirstName}</Text>
                            <Text px="1">{delivery.recipientLastName}</Text>
                          </VStack>
                        </PopoverTrigger>
                        <PopoverContent mx="1">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Info :</PopoverHeader>
                          <PopoverBody>{delivery.recipientFirstNameRecipient} {delivery.recipientLastName}</PopoverBody>
                          <PopoverBody>{delivery.recipientAddress}</PopoverBody>
                          <PopoverBody>{delivery.recipientInfo}</PopoverBody>
                          <PopoverBody>{delivery.recipientTel}</PopoverBody>
                          <PopoverBody>{delivery.recipientMail}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                    <Box minW="70px" flex="1">
                      {delivery.deliveryDistance}
                    </Box>
                    <Box maxW="80px" minW="60px" flex="1">
                      {delivery.deliveryAmount}
                    </Box>
                    <Box>
                      <Popover trigger="hover" >
                        <PopoverTrigger >
                          <Text minW="110px" flex="1" px="2">Deliveryman{delivery.deliverymanNameCompany}</Text>
                        </PopoverTrigger>
                        <PopoverContent mx="1">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Info :</PopoverHeader>
                          <PopoverBody>{delivery.deliverymanNameCompany}</PopoverBody>
                          <PopoverBody>M. {delivery.deliveymanName}</PopoverBody>
                          <PopoverBody>{delivery.deliverymanAddress}</PopoverBody>
                          <PopoverBody>{delivery.deliverymanInfo}</PopoverBody>
                          <PopoverBody>{delivery.deliverymanTel}</PopoverBody>
                          <PopoverBody>{delivery.deliverymanMail}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                    <Box minW="60px" flex="1" px="2">{delivery.deliveryStatus}
                    </Box>
                    <Box minW="90px" flex="1" px="2">{delivery.timestamp}
                    </Box>
                  </Flex>
                  <Divider />
                </Box>
              )
            })
          )
        }
      </Box>
      {
        displayAddDelivery && (
          <Box m="2" as="form" px="1" onSubmit={handleClickDeliveryRegister}>
            <Flex wrap="wrap" border="1px" borderRadius="lg" bg="blue.300" w="100%" mb="1">
              <VStack border="1px" borderRadius="lg" m="1" px="2" spacing="1px" justify="center">
                <Text as="b" fontSize="sm">Parcel</Text>
                <Text as="b" fontSize="sm">Sender</Text>
              </VStack>
              <Box minW="110px" flex="1" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="firstName">First name</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    placeholder="First name"
                    onChange={(event) => setSenderFirstName(event.target.value)}
                    value={senderFirstName}
                    isDisabled={true} />
                </FormControl>
              </Box>
              <Box minW="110px" flex="1" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="lastName">Last name</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    placeholder="Last name"
                    onChange={(event) => setSenderFirstName(event.target.value)}
                    value={senderLastName}
                    isDisabled={true} />
                </FormControl>
              </Box>
              <Box minW="310px" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="address">Address</FormLabel>
                  <Input
                    ref={searchInputSender}
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    list="suggestionList"
                    onChange={(event) => setSenderAddress(event.target.value)}
                    autoComplete="off"
                    placeholder="An address in Paris"
                    value={senderAddress.toLowerCase()}
                    isDisabled={true} />
                </FormControl>
                {
                  document.activeElement === searchInputSender.current && senderAddress && !isSenderAddress && <List as="ul"
                    fontSize="12px"
                    onClick={(event) => { setSenderAddress(event.target.textContent) }}
                    p="2"
                    spacing="1"
                    bg="gray.200"
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md">
                    {loading && (<ListItem>loading...</ListItem>)}
                    {!searchResultsSender.length && !loading && (<ListItem>No result.</ListItem>)}
                    {searchResultsSender.length && (
                      searchResultsSender.map((resultUser) => {
                        return (
                          <ListItem key={resultUser.id} _hover={{
                            background: "white",
                            fontSize: "15px",
                          }}>{resultUser.adresse} </ListItem>
                        )
                      }
                      )
                    )
                    }
                  </List>
                }
              </Box>
              <Box w="90px" mx="1">
                <FormControl>
                  <FormLabel my="0" htmlFor="info">Info</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    placeholder="info"
                    onChange={(event) => setSenderAddressInfo(event.target.value)}
                    value={senderAddressInfo}
                    isDisabled={true}
                  />
                </FormControl>
              </Box>
              <Box w="105px" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="tel">Tel</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="tel"
                    placeholder="Tel"
                    onChange={(event) => setSenderTel(event.target.value)}
                    value={senderTel}
                    isDisabled={true} />
                </FormControl>
              </Box>
              <Box minW="155px" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="email">Mail</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="email"
                    id="email"
                    placeholder="Last name"
                    onChange={(event) => setSenderMail(event.target.value)}
                    value={senderMail}
                    isDisabled={true} />
                </FormControl>
              </Box>
            </Flex>
            <Flex wrap="wrap" border="1px" borderRadius="lg" bg="teal.300" w="100%" mb="2">
              <VStack border="1px" borderRadius="lg" m="1" px="2" justify="center">
                <Text as="b" fontSize="sm">Recipient</Text>
              </VStack>
              <Box minW="110px" flex="1" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="firstName">First name</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    placeholder="First name"
                    onChange={(event) => setRecipientFirstName(event.target.value)}
                    value={recipientFirstName}
                    isInvalid={recipientFirstName === "" ? true : false} />
                </FormControl>
              </Box>
              <Box minW="110px" flex="1" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="lastName">Last name</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    placeholder="Last name"
                    onChange={(event) => setRecipientLastName(event.target.value)}
                    value={recipientLastName}
                    isInvalid={recipientLastName === "" ? true : false} />
                </FormControl>
              </Box>
              <Box minW="300" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="address">Address</FormLabel>
                  <Input
                    ref={searchInputRecipient}
                    mb="2"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    list="suggestionList"
                    onChange={(event) => setRecipientAddress(event.target.value)}
                    autoComplete="off"
                    placeholder="An address in Paris"
                    value={recipientAddress.toLowerCase()}
                    isInvalid={recipientAddress === "" || !isRecipientAddress ? true : false} />
                </FormControl>
                {
                  document.activeElement === searchInputRecipient.current && recipientAddress && !isRecipientAddress && <List as="ul"
                    fontSize="12px"
                    onClick={(event) => { setRecipientAddress(event.target.textContent) }}
                    p="2"
                    spacing="1"
                    bg="gray.200"
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md">
                    {loading && (<ListItem>loading...</ListItem>)}
                    {!searchResultsRecipient.length && !loading && (<ListItem>No result.</ListItem>)}
                    {searchResultsRecipient.length && (
                      searchResultsRecipient.map((result) => {
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
              </Box>
              <Box w="90px" mx="1">
                <FormControl>
                  <FormLabel my="0" htmlFor="info">Info</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="text"
                    placeholder="info"
                    onChange={(event) => setRecipientAddressInfo(event.target.value)}
                    value={recipientAddressInfo}
                  />
                </FormControl>
              </Box>
              <Box w="105px" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="tel">Tel</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="tel"
                    placeholder="Tel"
                    onChange={(event) => setRecipientTel(event.target.value)}
                    value={recipientTel}
                    isInvalid={recipientTel === "" ? true : false} />
                </FormControl>
              </Box>
              <Box minW="155px" mx="1">
                <FormControl isRequired>
                  <FormLabel my="0" htmlFor="email">Mail</FormLabel>
                  <Input
                    mb="1"
                    size="sm"
                    borderRadius="lg"
                    bg="light"
                    type="email"
                    id="email"
                    placeholder="Mail"
                    onChange={(event) => setRecipientMail(event.target.value)}
                    value={recipientMail}
                    isInvalid={recipientMail === "" ? true : false} />
                </FormControl>
              </Box>
            </Flex>
            <Flex wrap="wrap" justify="space-around">
              <Box>
                <Button
                  size="sm"
                  borderRadius="lg"
                  type="submit"
                  isLoading={isLoading}
                  colorScheme="blue"
                >Register delivery
                </Button>
              </Box>
              <Box>
                <Text> Distance : {deliveryDistance} Km</Text>
                <Text> Price : {deliveryPrice} DAID</Text>
              </Box>
              <Box>
                <Button
                  size="sm"
                  borderRadius="lg"
                  type="button"
                  isLoading={isLoading}
                  colorScheme="blue"
                  onClick={handleClickApprove} >Approve
                </Button>
              </Box>
            </Flex>
          </Box>
        )
      }
    </>
  )
}

export default ParcelSender