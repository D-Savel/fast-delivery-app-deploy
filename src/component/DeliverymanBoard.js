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
  Button,
  Heading,
  Input,
  useToast,
  Spacer,
  Divider,
  useDisclosure
} from '@chakra-ui/react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { Web3Context } from 'web3-hooks'
import { FastDeliveryNftContext } from '../App'
import { FastDeliveryUserContext } from '../App'
import { ethers, utils } from 'ethers'

function DeliverymanBoard(props) {
  const { selectedId, setSelectedId } = props
  const [web3State] = useContext(Web3Context)
  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()


  const [lastDeliveryId, setLastDeliveryId] = useState()
  const [deliveriesList, setDeliveriesList] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [idSelect2, setIdSelect2] = useState("")
  const [deliveryCode, setDeliveryCode] = useState("")
  const [displayAddDeliveryForDeliveryMan, setDisplayAddDeliveryForDeliveryMan] = useState(false)
  const [selectFilter, setSelectFilter] = useState(ethers.utils.getAddress(web3State.account))
  const [isChanging, setIsChanging] = useState(false)


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
          for (let i = 1; i <= lastDeliveryId; i++) {
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
          console.log(list, 'List')
        } catch (e) {
          console.log(e)
        } finally {
          setLoadingList(false)
          setIsChanging(false)
        }
      }
      const cb = (Sender, deliveryman, tokenId) => {
        getAllDeliveries()
      }
      if (!isChanging) { getAllDeliveries() }
      const inDeliveryFilter = fastDeliveryNft.filters.InDelivery(null, web3State.account)
      const attributedFilter = fastDeliveryNft.filters.Attributed(null, web3State.account)
      const deliveredFilter = fastDeliveryNft.filters.Delivered(null, web3State.account)
      // ecouter sur l'event Transfer
      fastDeliveryNft.on(attributedFilter, cb)
      fastDeliveryNft.on(deliveredFilter, cb)
      fastDeliveryNft.on(inDeliveryFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        fastDeliveryNft.off(inDeliveryFilter, cb)
        fastDeliveryNft.off(attributedFilter, cb)
        fastDeliveryNft.off(deliveredFilter, cb)
      }
    }
  }, [fastDeliveryNft, fastDeliveryUser, lastDeliveryId, setIsChanging, web3State.account, isChanging])

  const handleClickDisplayDelivery = () => {
    setDisplayAddDeliveryForDeliveryMan(!displayAddDeliveryForDeliveryMan)
    setIdSelect2("")
    setDeliveryCode("")
    selectFilter === ethers.constants.AddressZero ? setSelectFilter(ethers.utils.getAddress(web3State.account)) : setSelectFilter(ethers.constants.AddressZero)
  }

  // add A delivery for deliveryman
  const handleClickChooseDelivery = async (index) => {
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.attributeDelivery(index)
      await tx.wait()
      toast({
        title: `Confirmed transaction : delivery id ${index} have been added to your deliveries`,
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
      setIsChanging(true)
    }
  }

  // confirm a parcel is delivered by deliveryman
  const handleClickConfirmDelivered = async (index) => {
    console.log(deliveryCode, 'Delivery code')
    const deliveryInfo = await fastDeliveryNft.DeliveryInfo(index)
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.delivered(index, utils.keccak256(utils.toUtf8Bytes(deliveryCode.toString())))
      await tx.wait()
      toast({
        title: `Confirmed transaction : delivering for id ${index} has been registered \n Delivery id ${index} is payed`,
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
      setIsChanging(true)
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
      <Box w="100%" px="2" py="2">
        <HStack pl="1" py="2" position="sticky" top="125px" zIndex="sticky" alignItems="center" justifyContent="space-beetween" w="100%">
          <Heading size="md">{!displayAddDeliveryForDeliveryMan === true ? 'Deliveries' : 'Add Delivery'}</Heading>
          <Spacer />
          <Flex wrap="wrap" justifyContent="flex-end" alignItems="center">
            <Box>
              <Button
                mr="1"
                size="sm"
                type="button"
                borderRadius="lg"
                colorScheme="blue"
                onClick={handleClickDisplayDelivery}
              > {displayAddDeliveryForDeliveryMan === true ? '> My Deliveries' : '> Add Delivery'}</Button>
            </Box>
          </Flex>
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
                  <Box p="0" w="100 % " key={delivery.id} border={isNaN(delivery.id) ? '1px' : ''}>
                    < Flex wrap="wrap" mt={isNaN(delivery.id) ? '0' : '2'}>
                      <Box display="flex" alignItems="center" justifyContent="center" bg="gray.200" w="25px" px="1">{delivery.id}</Box>
                      <Box display="flex" mx="1" bg="blue.300" minW="250px">
                        <Popover isLazy trigger="hover" >
                          <PopoverTrigger>
                            <Flex mx="1" wrap="wrap" alignItems="center" justifyContent="center" maxW="240px">
                              {delivery.senderAddress}</Flex>
                          </PopoverTrigger>
                          <PopoverContent mx="1">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>{delivery.recipientFirstName} {delivery.recipientLastName}</PopoverBody>
                            <PopoverBody>{delivery.senderAddress}</PopoverBody>
                            <PopoverBody>{delivery.senderInfo}</PopoverBody>
                            <PopoverBody>{delivery.senderTel}</PopoverBody>
                            <PopoverBody>{delivery.senderMail}</PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                      <Box display="flex" mx="1" bg="teal.300" minW="250px">
                        <Popover isLazy trigger="hover" >
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
                      <Box display="flex" mx="1" alignItems="center" justifyContent="center" minW="90px">
                        {!isNaN(delivery.deliveryDistance) ? (Math.round(delivery.deliveryDistance * 100) / 100) : 'D'} (Km)
                      </Box>
                      <Box display="flex" mx="1" alignItems="center" justifyContent="center" minW="100px" >
                        {!isNaN(delivery.deliveryAmount) ? (Math.round(delivery.deliveryAmount * 100) / 100) : 'Price'} (DAID)
                      </Box>
                      <Popover isLazy trigger="hover" >
                        <PopoverTrigger>
                          <Box display="flex" flex="1" alignItems="center" justifyContent="center" bg="orange.200" minW="150px">
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
                      {delivery.deliveryStatus === "onLine" && (
                        <Box display="flex" mx="1" alignItems="center" justifyContent="center">
                          <Button
                            m="1"
                            p="2"
                            size="sx"
                            borderRadius="lg"
                            colorScheme="blue"
                            type="button"
                            onClick={() => {
                              onOpen()
                              setSelectedId(Number(delivery.id))
                            }
                            }>Add</Button>
                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalContent>
                              <ModalHeader>Add delivery confirmation</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody >
                                <Text>Do you want to add delivery : ID {(selectedId)}?</Text>
                              </ModalBody>
                              <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={onClose}>
                                  Close
                                </Button>
                                <Button
                                  colorScheme="blue"
                                  mr={3}
                                  onClick={() => {
                                    onClose()
                                    handleClickChooseDelivery(selectedId)
                                  }}
                                  variant="ghost">Ok</Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Box>
                      )}
                      {delivery.deliveryStatus === "inDelivery" && (
                        <Box display="flex" mx="1" alignItems="center" justifyContent="center">
                          <Button
                            m="1"
                            p="2"
                            size="sx"
                            borderRadius="lg"
                            colorScheme="orange"
                            type="button"
                            onClick={() => {
                              onOpen()
                              setSelectedId(Number(delivery.id))
                            }
                            }>ID {Number(delivery.id)} delivered</Button>
                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalContent>
                              <ModalHeader>Delivery confirmation</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody >
                                <Text>Please enter delivery code for delivery ID: {(selectedId)}</Text>
                                <Input
                                  w="85px"
                                  pl="1"
                                  type="number"
                                  placeholder="Code"
                                  onChange={(event) => setDeliveryCode(event.target.value)}
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={onClose}>
                                  Close
                                </Button>
                                <Button
                                  colorScheme="blue"
                                  mr={3}
                                  onClick={() => {
                                    onClose()
                                    handleClickConfirmDelivered(selectedId)
                                  }}
                                  variant="ghost">Ok</Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Box>
                      )
                      }
                    </Flex>
                    {!isNaN(delivery.id) && (<Divider />)}
                  </Box>
                )
              })
          )
        }
      </Box>
      {
        !loadingList &&
        (deliveriesList.filter(
          elem =>
            (elem.web3AddressDeliveryman === selectFilter ||
              elem.deliveryStatus === "Status") &&
            elem.deliveryAmount !== 0))
          .length === 1 &&
        displayAddDeliveryForDeliveryMan === true &&
        <Text> There is no deliveries on line</Text>
      }
      {
        !loadingList && (deliveriesList.filter(
          elem =>
            (elem.web3AddressDeliveryman === selectFilter ||
              elem.deliveryStatus === "Status") &&
            elem.deliveryAmount !== 0))
          .length < 1 && !displayAddDeliveryForDeliveryMan === true &&
        <Text> You don't have any delivery registered</Text>
      }
    </>
  )

}
export default DeliverymanBoard
