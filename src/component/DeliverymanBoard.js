import { useContext, useState, useEffect } from 'react'
import {
  Text,
  HStack,
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
} from '@chakra-ui/react'

import DeliverymanDelivery from './DeliverymanDelivery'
import { Web3Context } from 'web3-hooks'
import { FastDeliveryNftContext } from '../App'
import { FastDeliveryUserContext } from '../App'
import { ethers } from 'ethers'

function DeliverymanBoard(props) {
  const { selectedId, setSelectedId } = props

  const [web3State] = useContext(Web3Context)
  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const fastDeliveryUser = useContext(FastDeliveryUserContext)



  const [lastDeliveryId, setLastDeliveryId] = useState()
  const [deliveriesList, setDeliveriesList] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [displayAddDeliveryForDeliveryMan, setDisplayAddDeliveryForDeliveryMan] = useState(false)
  const [selectFilter, setSelectFilter] = useState(ethers.utils.getAddress(web3State.account))
  const [deliveryCode, setDeliveryCode] = useState("")


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
    let list = []
    let listHeader = {
      id: "Id",
      senderAddress: "Sender",
      recipientAddress: "Recipient",
      deliveryAmount: "Price",
      deliveryDistance: "D.",
      deliveryStatus: "Status",
      timestamp: "Date"
    }
    if (fastDeliveryNft) {
      const getAllDeliveries = async () => {
        try {
          list = []
          setLoadingList(true)
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
        }
      }
      const cb = (Sender, deliveryman, tokenId) => {
        list = []
        getAllDeliveries()
      }
      getAllDeliveries()

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
  }, [fastDeliveryNft, web3State.account, lastDeliveryId, fastDeliveryUser])

  const handleClickDisplayDelivery = () => {
    setDisplayAddDeliveryForDeliveryMan(!displayAddDeliveryForDeliveryMan)
    selectFilter === ethers.constants.AddressZero ? setSelectFilter(ethers.utils.getAddress(web3State.account)) : setSelectFilter(ethers.constants.AddressZero)
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
        <HStack pl="1" py="1" position="sticky" top="125px" zIndex="sticky" alignItems="center" justifyContent="space-beetween" w="100%">
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
                  <Box p="0" mt="2" w="100%" key={delivery.id} border="1px">
                    <DeliverymanDelivery delivery={delivery} deliveryCode={deliveryCode} setDeliveryCode={setDeliveryCode} selectedId={selectedId} setSelectedId={setSelectedId} />
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
