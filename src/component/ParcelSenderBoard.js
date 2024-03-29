import { useRef, useContext, useState, useEffect } from 'react'
import { FastDeliveryNftAddress } from '../contracts/FastDeliveryNft'
import ParcelSenderDelivery from './ParcelSenderDelivery';
import { getDistance } from 'ol/sphere';
import { ethers } from 'ethers'
import {
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
  HStack,
} from '@chakra-ui/react'

import axios from 'axios'
import { FastDeliveryNftContext } from '../App'
import { FastDeliveryUserContext } from '../App'
import { DaidTokenContext } from '../App'
import { Web3Context } from 'web3-hooks'
require('dotenv').config();

function ParcelSenderBoard(props) {
  const { selectedId, setSelectedId } = props

  const DELIVERY_PRICE = {
    _0_2: 1,
    _2_5: 2,
    _5_8: 3,
    _8_10: 4
  }
  const [web3State] = useContext(Web3Context)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)
  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const daidToken = useContext(DaidTokenContext)

  /* unused no fetch for sender
  const [loadingUser, setLoadingUser] = useState(false);
   */
  const [loadingRecipient, setLoadingRecipient] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [isApprove, setIsApprove] = useState(false)

  /* unused no fetch for sender
  const [searchResultsSender, setSearchResultsSender] = useState([]);
  */

  const [searchResultsRecipient, setSearchResultsRecipient] = useState([]);

  /* unused no fetch for sender
  const [isSenderAddress, setIsSenderAddress] = useState(true);
   */

  const [isRecipientAddress, setIsRecipientAddress] = useState(false);
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
  const [deliveryPrice, setDeliveryPrice] = useState('-')
  const [deliveryDistance, setDeliveryDistance] = useState('-')

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


  // verify allowance amount for user
  useEffect(() => {
    console.log("useEffect allowance vérification")
    if (daidToken) {
      const getAllowance = async () => {
        try {
          const _allowance = await daidToken.allowance(web3State.account, FastDeliveryNftAddress)
          const allowance = ethers.utils.formatEther(_allowance)
          Number(allowance) < deliveryPrice ? setIsApprove(false) : setIsApprove(true)
        } catch (e) {
          console.log(e.message)
        } finally {
          setIsLoading(false)
        }
      }
      getAllowance()
    }
  }, [daidToken, web3State.account, deliveryPrice, setIsApprove, isApprove])



  // fetch User Info
  useEffect(() => {
    console.log("useEffect fetch user info")
    if (fastDeliveryUser) {
      const getUserInfo = async () => {
        try {
          const userInfo = await fastDeliveryUser.getUserInfo(web3State.account)
          setSenderFirstName(userInfo.firstName)
          setSenderLastName(userInfo.lastName)
          setSenderAddress(userInfo.userAddress)
          setSenderAddressX(userInfo.addressX)
          setSenderAddressY(userInfo.addressY)
          setSenderTel(userInfo.tel)
          setSenderMail(userInfo.mail)
        } catch (e) {
          console.log(e.message)
        }
      }
      getUserInfo()
    }
  }, [fastDeliveryUser, web3State.account, setSenderAddress])

  // fetch all delivery id for user
  useEffect(() => {
    console.log("fetch deliveries id for a user")
    if (fastDeliveryNft) {
      const getDeliveryId = async () => {
        try {
          const id = await fastDeliveryNft.getDeliveriesIdByAddress(web3State.account)
          console.log(id, "list id for user")
          setDeliveryIdSender(id.filter(index => Number(index) !== 0))
        } catch (e) {
          console.log(e.message)
        }
      }
      const cb = (Sender, tokenId) => {
        getDeliveryId()
      }
      getDeliveryId()
      const onLineFilter = fastDeliveryNft.filters.OnLine(web3State.account)
      const deletedFilter = fastDeliveryNft.filters.Deleted(web3State.account)
      // ecouter sur l'event de FastdeliveryNft
      fastDeliveryNft.on(onLineFilter, cb)
      fastDeliveryNft.on(deletedFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        fastDeliveryNft.off(onLineFilter, cb)
        fastDeliveryNft.off(deletedFilter, cb)
      }
    }
  }, [fastDeliveryNft, web3State.account])

  // fetch deliveries an create an array of deliveries for user
  useEffect(() => {
    console.log(deliveryIdSender, "Delivery Id sender")
    console.log("useEffect : Create deliveries Array")
    const deliveryStatusEnum = {
      0: "onLine",
      1: "attributed",
      2: "inDelivery",
      3: "delivered",
      4: "deleted"
    }
    let list = []
    let listHeader = {
      id: "Id",
      senderFirstName: "Sender",
      recipientFirstName: "Recipient",
      deliveryAmount: "Price",
      deliveryDistance: "D.",
      deliverymanCompany: "Deliveryman",
      deliveryStatus: "Status",
      timestamp: "Date"
    }
    if (fastDeliveryNft) {
      list = []
      const getDeliveriesList = async () => {
        try {
          setLoadingList(true)
          for (let id of deliveryIdSender) {
            let idNumber = Number(id)
            let DeliveryDateStatus
            let DeliveryStatusInfo
            const deliveryInfo = await fastDeliveryNft.DeliveryInfo(idNumber)
            switch (deliveryInfo.status) {
              case 0:
                DeliveryDateStatus = new Date(Number(deliveryInfo.onlineTimestamp * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[0]
                break;
              case 1:
                DeliveryDateStatus = new Date(Number(deliveryInfo.attributionTimestamp * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[1]
                break;
              case 2:
                DeliveryDateStatus = new Date(Number(deliveryInfo.collectTimestamp * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[2]
                break;
              case 3:
                DeliveryDateStatus = new Date(Number(deliveryInfo.deliveredTimestamp * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[3]
                break;
              case 4:
                DeliveryDateStatus = new Date(Number(deliveryInfo.onlineTimestamp * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[4]
                break;
              default:
                DeliveryDateStatus = "Date Error"
                DeliveryStatusInfo = "Status Error"
            }
            let web3AddressDeliveryman = deliveryInfo.deliveryman
            let deliverymanInfo
            if (web3AddressDeliveryman !== "0x0000000000000000000000000000000000000000") {
              deliverymanInfo = await fastDeliveryUser.getUserInfo(web3AddressDeliveryman)
            } else {
              deliverymanInfo = { lastName: "-" }
            }
            const delivery = {
              id: idNumber,
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
              deliverymanCompany: deliverymanInfo.lastName,
              deliverymanManagerName: deliverymanInfo.firstName,
              deliverymanAddress: deliverymanInfo.userAddress,
              deliverymanTel: deliverymanInfo.tel,
              deliverymanMail: deliverymanInfo.mail,
              deliveryAmount: ethers.utils.formatEther(deliveryInfo.deliveryAmount),
              deliveryDistance: deliveryInfo.deliveryDistance,
              deliveryStatus: DeliveryStatusInfo,
              timestamp: ("0" + DeliveryDateStatus.getDate()).slice(-2) + "-" + ("0" + (DeliveryDateStatus.getMonth() + 1)).slice(-2) + "-" +
                DeliveryDateStatus.getFullYear() + " " + ("0" + DeliveryDateStatus.getHours()).slice(-2) + ":" + ("0" + DeliveryDateStatus.getMinutes()).slice(-2)
            }
            list.push(delivery)
          }
          if (list.length > 0)
            list
              .reverse()
              .unshift(listHeader)
          setDeliveriesList(list)
          console.log("useEffect : Set deliveries Array")
        } catch (e) {
          console.log(e.message)
        } finally {
          setLoadingList(false)
        }
      }
      const cb = (Sender, deliveryman, tokenId) => {
        console.log("Event : Set deliveries Array")
        list = []
        getDeliveriesList()
      }
      getDeliveriesList()

      const onLineFilter = fastDeliveryNft.filters.OnLine(web3State.account)
      const attributedFilter = fastDeliveryNft.filters.Attributed(web3State.account)
      const inDeliveryFilter = fastDeliveryNft.filters.InDelivery(web3State.account)
      const deliveredFilter = fastDeliveryNft.filters.Delivered(web3State.account)
      // ecouter sur l'event when status changed
      fastDeliveryNft.on(onLineFilter, cb)
      fastDeliveryNft.on(inDeliveryFilter, cb)
      fastDeliveryNft.on(attributedFilter, cb)
      fastDeliveryNft.on(deliveredFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        fastDeliveryNft.off(onLineFilter, cb)
        fastDeliveryNft.off(inDeliveryFilter, cb)
        fastDeliveryNft.off(attributedFilter, cb)
        fastDeliveryNft.off(deliveredFilter, cb)

      }
    }
  }, [deliveryIdSender, fastDeliveryNft, fastDeliveryUser, senderAddress, senderAddressInfo, senderFirstName, senderLastName, senderMail, senderTel, web3State.account])


  /* unused no fetch for sender
   
  // fetch address for sender input
  useEffect(() => {
    let url = `https://stormy-gorge-78325.herokuapp.com/address/?address=${senderAddress}`
    console.log(url, 'url Sender search')
    const request = async () => {
      setLoadingUser(true)
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
        setLoadingUser(false)
      }
    }
    request()
  }
    , [senderAddress, isMounted])
    */

  // Calculate distance and price for delivery with delivery distance
  useEffect(() => {
    console.log("useEffect calculate distance and fix price for delivery ")
    if (isRecipientAddress) {
      setDeliveryDistance((Math.round((getDistance([senderAddressX, senderAddressY], [recipientAddressX, recipientAddressY]))) / 1000))
    }
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
    getPrice()
  }
    , [DELIVERY_PRICE._0_2, DELIVERY_PRICE._2_5, DELIVERY_PRICE._5_8, DELIVERY_PRICE._8_10, deliveryDistance, isRecipientAddress, recipientAddressX, recipientAddressY, senderAddressX, senderAddressY])

  // fetch address for recipient input
  useEffect(() => {
    console.log("useEffect fetch address for recipient")
    const { cancel, token } = axios.CancelToken.source();
    const urlServer = process.env.REACT_APP_URL_SERVER
    let fetchUrl = `${urlServer}/address/?address=${recipientAddress}`
    console.log(fetchUrl, 'Add recipient search')
    const request = async () => {
      setLoadingRecipient(true)
      try {
        let response = await axios.get(fetchUrl, token)
        setSearchResultsRecipient(response.data)
        if (response.data.length) {
          recipientAddress.toUpperCase().trim().localeCompare(response.data[0].adresse.trim()) === 0 ? setIsRecipientAddress(true) : setIsRecipientAddress(false)
          setRecipientAddressX(response.data[0].lon.toString())
          setRecipientAddressY(response.data[0].lat.toString())
        }
      } catch (e) {
        console.log(e.message)
      } finally {
        setLoadingRecipient(false)
        if (!recipientAddress === "") {
          setIsRecipientAddress(false)
        }
      }
    }
    const timeOutId = setTimeout(() => request(), 500)
    return () => cancel("No longer latest query") || clearTimeout(timeOutId);
  }, [recipientAddress])


  const handleClickDisplayDelivery = () => {
    setDisplayAddDelivery(!displayAddDelivery)
  }

  // Approve function
  const handleClickApprove = async () => {
    try {
      setLoadingApprove(true)
      let tx = await daidToken.approve(FastDeliveryNftAddress, ethers.utils.parseUnits("1000000"))
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
      console.log(e.message)
    } finally {
      setIsApprove(true)
      setLoadingApprove(false)
    }
  }

  // Register delivery function
  const handleClickDeliveryRegister = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.createDelivery(recipientFirstName, recipientLastName, recipientAddress, recipientAddressX, recipientAddressY, recipientAddressInfo, recipientTel, recipientMail, ethers.utils.parseUnits(deliveryPrice.toString()), deliveryDistance.toString())
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
      console.log(e.message)
    } finally {
      setIsLoading(false)
      setRecipientFirstName("")
      setRecipientLastName("")
      setRecipientAddress("")
      setRecipientAddressInfo("")
      setRecipientTel("")
      setRecipientMail("")
      setIsRecipientAddress(false)
    }
  }

  return (
    <>
      <Box w="100%" px="2" py="2">
        <HStack position="sticky" top="125px" zIndex="sticky" pt="1" alignItems="center" justifyContent="space-beetween" w="100%">
          <Heading pl="3" size="md">{!displayAddDelivery ? 'Deliveries' : 'Add Delivery'}</Heading>
          <Spacer />
          <Box>
            <Button
              my="1"
              size="sm"
              type="button"
              borderRadius="lg"
              colorScheme="blue"
              onClick={handleClickDisplayDelivery}
            > {displayAddDelivery ? '> My Deliveries' : '> Add Delivery'}</Button>
          </Box>
        </HStack>
        {loadingList &&
          <Text> Loading...</Text>
        }
        {
          !loadingList && deliveryIdSender.length < 1 && !displayAddDelivery &&
          <Text> You don't have any delivery registered</Text>
        }
        {
          !loadingList && deliveryIdSender.length > 0 && !displayAddDelivery && (
            deliveriesList.map((delivery) => {
              return (
                <Box p="0" m="0" mt="2" w="100% " key={delivery.id} border="1px">
                  <ParcelSenderDelivery
                  delivery={delivery}
                  senderFirstName={senderFirstName}
                  senderLastName={senderLastName}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}/>
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
                {/* unused fetching : Address is user address and can't be changed at the moment

                {
                document.activeElement === searchInputSender.current && senderAddress && !isSenderAddress &&
                <List as="ul"
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
                    }
                  </List>
                  */

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
                  document.activeElement === searchInputRecipient.current && recipientAddress && !isRecipientAddress &&
                  <List as="ul"
                    fontSize="12px"
                    onClick={(event) => { setRecipientAddress(event.target.textContent) }}
                    p="2"
                    spacing="1"
                    bg="gray.200"
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md">
                    {loadingRecipient && (<ListItem>loading...</ListItem>)}
                    {!searchResultsRecipient.length && !loadingRecipient && (<ListItem>No result.</ListItem>)}
                    {searchResultsRecipient.length && (
                      searchResultsRecipient.map((result) => {
                        return (
                          <ListItem key={result.id} _hover={{
                            background: "white"
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
                  type="button"
                  isLoading={loadingApprove}
                  colorScheme={isApprove ? "green" : "orange"}
                  onClick={handleClickApprove}
                  isDisabled={isApprove && true}
                >{isApprove ? "Approved" : "Approve"}
                </Button>
              </Box>
              <Box>
                <Text> {isRecipientAddress && recipientAddress ? `Distance : ${deliveryDistance}` : "Distance : -"} Km</Text>
                <Text> {isRecipientAddress && recipientAddress ? `Price : ${deliveryPrice}` : "Price : -"} DAID</Text>
              </Box>
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
            </Flex>
          </Box>
        )
      }
    </>
  )
}

export default ParcelSenderBoard
