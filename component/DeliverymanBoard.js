import { useContext, useState, useEffect } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  Text,
  HStack,
  Box,
  Flex,
  FormControl,
  Button,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  useToast,
  Spacer,
  Divider
} from '@chakra-ui/react'
import { Web3Context } from 'web3-hooks'
import { FastDeliveryNftContext } from '../App'
import { FastDeliveryUserContext } from '../App'
import { ethers, utils } from 'ethers'

function DeliverymanBoard() {
  const [web3State] = useContext(Web3Context)
  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)
  const toast = useToast()


  const [lastDeliveryId, setLastDeliveryId] = useState()
  const [deliveriesList, setDeliveriesList] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [idSelect2, setIdSelect2] = useState("")
  const [deliveryCode, setDeliveryCode] = useState("")
  const [displayAddDelivery2, setDisplayAddDelivery2] = useState(false)
  const [selectFilter, setSelectFilter] = useState(ethers.utils.getAddress(web3State.account))


  // get last Nft number id
  useEffect(() => {
    if (fastDeliveryNft) {
      const getLastDeliveryId = async () => {
        try {
          const lastId = await fastDeliveryNft.getlastId()
          setLastDeliveryId(Number(lastId))
        } catch (e) {
          console.log(e)
        }
      }
      getLastDeliveryId()
    }
  }, [fastDeliveryNft])


  // fetch all deliveries
  useEffect(() => {
    const deliveryStatusEnum = {
      0: "onLine",
      1: "attributed",
      2: "inDelivery",
      3: "delivered",
      4: "deleted"
    }
    let listHeader = {
      id: "Id",
      senderAddress: "Sender",
      recipientAddress: "Recipient",
      deliveryAmount: "Price",
      deliveryDistance: "D.",
      deliveryStatus: "Status",
      timestamp: "Date"
    }
    let list = []
    if (fastDeliveryNft) {
      const getAllDeliveries = async () => {
        setLoadingList(true)
        try {
          let deliveryDateStatus
          let deliveryStatusInfo
          for (let i = 0; i <= lastDeliveryId; i++) {
            const deliveryInfo = await fastDeliveryNft.DeliveryInfo(i)
            switch (deliveryInfo.status) {
              case 0:
                deliveryDateStatus = new Date(Number(deliveryInfo.onlineTimestamp * 1000))
                deliveryStatusInfo = deliveryStatusEnum[0]
                break;
              case 1:
                deliveryDateStatus = new Date(Number(deliveryInfo.attributionTimestamp * 1000))
                deliveryStatusInfo = deliveryStatusEnum[1]
                break;
              case 2:
                deliveryDateStatus = new Date(Number(deliveryInfo.collectTimestamp * 1000))
                deliveryStatusInfo = deliveryStatusEnum[2]
                break;
              case 3:
                deliveryDateStatus = new Date(Number(deliveryInfo.deliveredTimestamp * 1000))
                deliveryStatusInfo = deliveryStatusEnum[3]
                break;
              case 4:
                deliveryDateStatus = new Date(Number(deliveryInfo.onlineTimestamp * 1000))
                deliveryStatusInfo = deliveryStatusEnum[4]
                break;
              default:
                deliveryDateStatus = "Date Error"
                deliveryStatusInfo = "Status Error"
            }

            const senderInfo = await fastDeliveryUser.getUserInfo(deliveryInfo.parcelSender)
            const delivery = {
              id: i,
              web3AddressDeliveryman: deliveryInfo.deliveryman,
              senderFirstName: senderInfo.firstName,
              senderLastName: senderInfo.lastName,
              senderAddress: senderInfo.userAddress,
              senderAddressInfo: senderInfo.addressInfo,
              senderTel: senderInfo.tel,
              senderMail: senderInfo.mail,
              recipientFirstName: deliveryInfo.recipientFirstName,
              recipientLastName: deliveryInfo.recipientLastName,
              recipientAddress: deliveryInfo.recipientAddress,
              recipientAddressInfo: deliveryInfo.recipientAddressInfo,
              recipientTel: deliveryInfo.recipientTel,
              recipientMail: deliveryInfo.recipientMail,
              deliveryAmount: Number(ethers.utils.formatEther(deliveryInfo.deliveryAmount)) * 0.8,
              deliveryDistance: deliveryInfo.deliveryDistance,
              deliveryStatus: deliveryStatusInfo,
              timestamp: ("0" + deliveryDateStatus.getDate()).slice(-2) + "-" + ("0" + (deliveryDateStatus.getMonth() + 1)).slice(-2) + "-" +
                deliveryDateStatus.getFullYear() + " " + ("0" + deliveryDateStatus.getHours()).slice(-2) + ":" + ("0" + deliveryDateStatus.getMinutes()).slice(-2)
            }
            if (delivery.deliveryStatus !== "deleted" && delivery.deliveryAmount !== 0) {
              list.push(delivery)
            }
          }
          if (list.length > 0)
            list
              .reverse()
              .unshift(listHeader)
          setDeliveriesList(list)
        } catch (e) {
          console.log(e)
        } finally {
          setLoadingList(false)
        }
      }
      const cb = (Sender, deliveryman, tokenId) => {
        getAllDeliveries()
      }
      getAllDeliveries()
      const attributedFilter = fastDeliveryNft.filters.Attributed(null, web3State.account)
      const deliveredFilter = fastDeliveryNft.filters.Delivered(null, web3State.account)
      const inDeliveryFilter = fastDeliveryNft.filters.InDelivery(null, web3State.account)
      // ecouter sur l'event Transfer

      fastDeliveryNft.on(attributedFilter, cb)
      fastDeliveryNft.on(deliveredFilter, cb)
      fastDeliveryNft.on(inDeliveryFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        fastDeliveryNft.off(attributedFilter, cb)
        fastDeliveryNft.off(attributedFilter, cb)
        fastDeliveryNft.off(inDeliveryFilter, cb)
      }
    }
  }, [fastDeliveryNft, fastDeliveryUser, lastDeliveryId, web3State.account])

  const handleClickDisplayDelivery2 = () => {
    setDisplayAddDelivery2(!displayAddDelivery2)
    setIdSelect2("")
    setDeliveryCode("")
    selectFilter === ethers.constants.AddressZero ? setSelectFilter(ethers.utils.getAddress(web3State.account)) : setSelectFilter(ethers.constants.AddressZero)
  }

  // add A delivery for deliveryman
  const handleClickChooseDelivery = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.attributeDelivery(idSelect2)
      await tx.wait()
      toast({
        title: `Confirmed transaction : delivery id ${idSelect2} have been added to your deliveries`,
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
      setIdSelect2("")
    }
  }

  // confirm a parcel is delivered by deliveryman
  const handleClickConfirmDelivered = async (e) => {
    e.preventDefault()
    const deliveryInfo = await fastDeliveryNft.DeliveryInfo(idSelect2)
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.delivered(idSelect2, utils.keccak256(utils.toUtf8Bytes(deliveryCode.toString())))
      await tx.wait()
      toast({
        title: `Confirmed transaction : delivering for id ${idSelect2} has been registered \n Delivery id ${idSelect2} is payed`,
        description: `Transaction hash: ${tx.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (e) {
      if (utils.keccak256(utils.toUtf8Bytes(deliveryCode.toString())) !== deliveryInfo.deliveryCode) {
        toast({
          title: 'Transaction denied',
          description: `Delivery code is false for Id ${idSelect2}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
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
      setIdSelect2("")
      setDeliveryCode("")
    }
  }

  /* no implemented
  const handleClickCancel = async () => {
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.cancelDelivery(Number(idSelect2))
      await tx.wait()
      toast({
        title: `Confirmed transaction : Delivery id ${idSelect2} has been canceled`,
        description: `Transaction hash: ${tx.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (e) {
      if (e.code) {
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
    }
  }
  */


  return (
    <>
      <HStack pl="1" py="2" position="sticky" top="125px" zIndex="sticky" alignItems="center" justifyContent="space-beetween" w="100%">
        <Heading size="md">{!displayAddDelivery2 === true ? 'Deliveries' : 'Add Delivery'}</Heading>
        <Spacer />
        <Flex wrap="wrap" justifyContent="flex-end" alignItems="center">
          <Box>
            <Button
              mr="1"
              size="sm"
              type="button"
              borderRadius="lg"
              colorScheme="blue"
              onClick={handleClickDisplayDelivery2}
            > {displayAddDelivery2 === true ? '> My Deliveries' : '> + Delivery'}</Button>
          </Box>
          {displayAddDelivery2 === true && (
            <Box as="form">
              <FormControl isRequired>
                <InputGroup w="90px">
                  <Input
                    type="number"
                    placeholder="Id"
                    onChange={(event) => setIdSelect2(event.target.value)}
                    value={idSelect2}
                  />
                  <InputRightElement>
                    <Button
                      mr="1"
                      size="sm"
                      borderRadius="lg"
                      colorScheme="blue"
                      type="button"
                      isLoading={isLoading}
                      onClick={handleClickChooseDelivery}>
                      Add
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
          )}
        </Flex>
        {!displayAddDelivery2 === true && (
          <Box as="form" >
            <FormControl isRequired>
              <InputGroup w="175px" >
                <HStack>
                  <Input
                    w="85px"
                    pl="1"
                    type="number"
                    placeholder="Code"
                    onChange={(event) => setDeliveryCode(event.target.value)}
                    value={deliveryCode}
                  />
                  <Input
                    type="number"
                    placeholder="Id"
                    onChange={(event) => setIdSelect2(event.target.value)}
                    value={idSelect2}
                  />
                </HStack>
                <InputRightElement w="70px">
                  <Button
                    w="100px"
                    px="1"
                    mr="1"
                    size="sm"
                    borderRadius="lg"
                    colorScheme="blue"
                    type="button"
                    isLoading={isLoading}
                    onClick={handleClickConfirmDelivered}>
                    Delivered
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        )}
      </HStack>
      {
        loadingList &&
        <Text> Loading...</Text>
      }
      {
        !loadingList && (
          deliveriesList.filter(
            elem =>
              elem.web3AddressDeliveryman === selectFilter ||
              elem.deliveryStatus === "Status"

          )
            .map(delivery => {
              return (
                <Box pt="2" w="100 % " key={delivery.id}>
                  <Flex wrap="wrap" mt="2" >
                    <Box display="flex" alignItems="center" justifyContent="center" bg="gray.200" w="25px" px="1">{delivery.id}</Box>
                    <Box display="flex" mx="1" bg="blue.300" minW="250px">
                      <Popover trigger="hover" >
                        <PopoverTrigger>
                          <Flex mx="1" wrap="wrap" alignItems="center" justifyContent="center" maxW="240px">
                            {delivery.senderAddress}</Flex>
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
                    <Box display="flex" mx="1" bg="teal.300" minW="250px">
                      <Popover trigger="hover" >
                        <PopoverTrigger>
                          <Flex mx="1" wrap="wrap" alignItems="center" justifyContent="center" maxW="240px">
                            {delivery.recipientAddress}</Flex>
                        </PopoverTrigger>
                        <PopoverContent mx="1">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>{delivery.recipientFirstName} {delivery.recipientLastName}</PopoverBody>
                          <PopoverBody>{delivery.recipientAddress}</PopoverBody>
                          <PopoverBody>{delivery.recipientInfo}</PopoverBody>
                          <PopoverBody>{delivery.recipientTel}</PopoverBody>
                          <PopoverBody>{delivery.recipientMail}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                    <Box display="flex" mx="1" alignItems="center" justifyContent="center" minW="110px">
                      {delivery.deliveryDistance} (Km)
                    </Box>
                    <Box display="flex" mx="1" alignItems="center" justifyContent="center" minW="110px" >
                      {delivery.deliveryAmount} (DAID)
                    </Box>
                    <Popover trigger="hover" >
                      <PopoverTrigger>
                        <Box display="flex" flex="1" alignItems="center" justifyContent="center" bg="orange.200" minW="100px">
                          {delivery.deliveryStatus}
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent mx="1">
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>{delivery.deliveryStatus}</PopoverBody>
                        <PopoverBody>{delivery.timestamp}</PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                  <Divider />
                </Box>
              )
            })
        )
      }
      {
        !loadingList &&
        (deliveriesList.filter(
          elem =>
            (elem.web3AddressDeliveryman === selectFilter ||
              elem.deliveryStatus === "Status") &&
            elem.deliveryAmount !== 0))
          .length === 1 &&
        displayAddDelivery2 === true &&
        <Text> There is no deliveries on line</Text>
      }
      {
        !loadingList && (deliveriesList.filter(
          elem =>
            (elem.web3AddressDeliveryman === selectFilter ||
              elem.deliveryStatus === "Status") &&
            elem.deliveryAmount !== 0))
          .length < 1 && !displayAddDelivery2 === true &&
        <Text> You don't have any delivery registered</Text>
      }
    </>
  )

}
export default DeliverymanBoard

