/* eslint-disable no-unused-vars */
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
import { Web3Context } from 'web3-hooks'
import { FastDeliveryNftContext } from '../App'
import { FastDeliveryUserContext } from '../App'

function DeliverymanBoard() {

  /*
  const [web3State] = useContext(Web3Context)
  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)
  const toast = useToast()

  const [deliveryId, setDeliveryId] = useState([])
  const [deliveriesList, setDeliveriesList] = useState([])
  const [deliverySelect, setDeliverySelect] = useState("onLine")
  const [loadingList, setLoadingList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deliveriesOnlineList, setDeliveriesOnlineList] = useState([])
  const [deliveriesUserList, setDeliveriesUserList] = useState([])


  // fetch all delivery id for user
  useEffect(() => {
    if (fastDeliveryNft) {
      const getDeliveryId = async () => {
        try {
          const id = await fastDeliveryNft.getDeliveriesIdByAddress(web3State.account)
          setDeliveryId(id)
        } catch (e) {
          console.log(e)
        }
      }
      getDeliveryId()
    }
  }, [fastDeliveryNft, web3State.account])


  // fetch all onLine deliveries and all deliveries for user
  useEffect(() => {
    const deliveryStatusEnum = {
      0: "onLine",
      1: "attributed",
      2: "inDelivery",
      3: "delivered",
      4: "deleted"
    }
    let list = []
    if (fastDeliveryNft & fastDeliveryUser) {
      const getAllDeliveries = async () => {
        setLoadingList(true)
        try {
          let DeliveryDateStatus
          let DeliveryStatusInfo
          const lastDeliveryId = 10
          for (let i = 0; i <= lastDeliveryId; i++) {
            const deliveryInfo = await fastDeliveryNft.DeliveryInfo(i)
            switch (deliveryInfo.status) {
              case 0:
                DeliveryDateStatus = new Date(Number(deliveryInfo[13] * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[0]
                break;
              case 1:
                DeliveryDateStatus = new Date(Number(deliveryInfo[14] * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[1]
                break;
              case 2:
                DeliveryDateStatus = new Date(Number(deliveryInfo[15] * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[2]
                break;
              case 3:
                DeliveryDateStatus = new Date(Number(deliveryInfo[16] * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[3]
                break;
              case 4:
                DeliveryDateStatus = new Date(Number(deliveryInfo[13] * 1000))
                DeliveryStatusInfo = deliveryStatusEnum[3]
                break;
              default:
                DeliveryDateStatus = "Date Error"
                DeliveryStatusInfo = "Status Error"
            }

            const senderInfo = await fastDeliveryUser.getUserInfo(deliveryInfo.parcelSender)
            const deliveries = {
              id: i,
              senderFirstName: senderInfo.firstName,
              senderLastName: senderInfo.lastName,
              senderAddress: senderInfo.userAddress,
              senderAddressInfo: senderInfo.addressInfo,
              senderTel: senderInfo.tel,
              senderMail: senderInfo.mail,
              recipientFirstName: deliveryInfo[3],
              recipientLastName: deliveryInfo[4],
              recipientAddress: deliveryInfo[5],
              recipientAddressInfo: deliveryInfo[8],
              recipientTel: deliveryInfo[9],
              recipientMail: deliveryInfo[10],
              deliveryAmount: Number(deliveryInfo.deliveryAmount) - 1,
              deliveryDistance: deliveryInfo.deliveryDistance,
              deliveryStatus: DeliveryStatusInfo,
              timestamp: ("0" + DeliveryDateStatus.getDate()).slice(-2) + "-" + ("0" + (DeliveryDateStatus.getMonth() + 1)).slice(-2) + "-" +
                DeliveryDateStatus.getFullYear() + " " + ("0" + DeliveryDateStatus.getHours()).slice(-2) + ":" + ("0" + DeliveryDateStatus.getMinutes()).slice(-2)
            }
            list.push(deliveries)
          }
          console.log(list)
          setDeliveriesList(list)
          setDeliveriesOnlineList(list.filter(delivery => delivery.deliveryStatus === "onLine"))
          setDeliveriesUserList(list.filter(elem => deliveryId.includes(elem.id)))
        } catch (e) {
          console.log(e)
        } finally {
          setLoadingList(false)
        }
      }
      getAllDeliveries()
    }
  }, [deliveryId, fastDeliveryNft, fastDeliveryUser, web3State.account])

  const handleClickChooseDelivery = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.attributeDelivery(2)
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

    }
  }
  */
  return (
    <>
      <p> Deliveryman Board</p>
      { /*}
      <HStack>
        <Box>
          <Button
            size="sm"
            borderRadius="lg"
            type="button"
            isLoading={isLoading}
            colorScheme="blue"
            onClick={handleClickChooseDelivery}
          >Add for Delivering
          </Button>
        </Box>
        <Box>
          <Button
            size="sm"
            borderRadius="lg"
            type="button"
            isLoading={isLoading}
            colorScheme="blue"
            onClick={deliverySelect === "onLine" ? setDeliverySelect("User") : setDeliverySelect("onLine")}
          > {deliverySelect === "onLine" ? "> My Deliveries" : "> Online Deliveries"}
          </Button>
        </Box>
      </HStack>
          {
        loadingList &&
        <Text> Loading...</Text>
      }
      {
        !loadingList && deliveriesList.length < 1 && deliverySelect === "User" &&
        <Text> You don't have any delivery registered</Text>
      }
      {
        !loadingList && (
          deliveriesList.filter(elem => elem.deliveryStatus === "onLine").map((delivery) => {
            return (
              <Box pt="2" w="100 % " key={delivery.id}>
                <Flex wrap="wrap" mt="2" >
                  <Box display="flex" alignItems="center" justifyContent="center" w="25px" px="1">{delivery.id}</Box>
                  <Box display="flex" mx="1" bg="blue.300">
                    <Popover trigger="hover" >
                      <PopoverTrigger>
                        <Box display="flex" flex="1" alignItems="center" minW="155px" justifyContent="center">
                          {delivery.senderFirstName} {delivery.senderLastName}</Box>
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
                  <Box display="flex" mx="1" bg="teal.300">
                    <Popover trigger="hover" >
                      <PopoverTrigger>
                        <Box display="flex" flex="1" alignItems="center" minW="155px" justifyContent="center" h="100%">
                          {delivery.recipientFirstName} {delivery.recipientLastName}</Box>
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
                  <Box display="flex" mx="1" bg="red.300">
                    <Popover trigger="hover" >
                      <PopoverTrigger>
                        <Box display="flex" flex="1" alignItems="center" minW="155px" justifyContent="center" h="100%">
                          {delivery.deliverymanCompany}</Box>
                      </PopoverTrigger>
                      <PopoverContent mx="1">
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>{delivery.deliverymanCompany}</PopoverBody>
                        <PopoverBody>M. {delivery.deliverymanManagerName}</PopoverBody>
                        <PopoverBody>{delivery.deliverymanAddress}</PopoverBody>
                        <PopoverBody>{delivery.deliverymanTel}</PopoverBody>
                        <PopoverBody>{delivery.deliverymanMail}</PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                  <Box display="flex" flex="1" alignItems="center" justifyContent="center" minW="100x">
                    {delivery.deliveryStatus}
                  </Box>
                  <Box display="flex" flex="1" alignItems="center" justifyContent="center" minW="100" px="2">
                    {delivery.timestamp}
                  </Box>
                </Flex>
                <Divider />
              </Box>
            )
          })
        )
      }
      */}
    </>
  )
}
export default DeliverymanBoard