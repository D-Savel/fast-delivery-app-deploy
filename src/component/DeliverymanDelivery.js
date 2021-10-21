import { useContext, useState } from 'react'
import { utils } from 'ethers'
import { FastDeliveryNftContext } from '../App'

import {
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  Text,
  Box,
  Input,
  Flex,
  Button,
  useToast,
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

const DeliverymanDelivery = (props) => {

  const { delivery, selectedId, setSelectedId, deliveryCode, setDeliveryCode } = props

  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)


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
          description: `Delivery code is false for Id ${index}`,
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
      setDeliveryCode("")
    }
  }

  return (
    <Flex wrap="wrap">
      <Box display="flex" alignItems="center" justifyContent="center" bg="gray.200" w="25px" px="1">{delivery.id}</Box>
      <Box display="flex" mx="1" bg="blue.300" minW="250px">
        <Popover isLazy trigger="hover" >
          <PopoverTrigger>
            <Flex wrap="wrap" alignItems="center" justifyContent="center" maxW="240px">
              {delivery.senderAddress}</Flex>
          </PopoverTrigger>
          <PopoverContent mx="1">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>{delivery.senderFirstName} {delivery.senderLastName}</PopoverBody>
            <PopoverBody>{delivery.senderAddress}</PopoverBody>
            <PopoverBody>{delivery.senderInfo}</PopoverBody>
            <PopoverBody>{delivery.senderTel}</PopoverBody>
            <PopoverBody>{delivery.senderMail}</PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      <Box display="flex" me="1" bg="teal.300" minW="250px">
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
      <Box display="flex" me="1" borderRight="1px" alignItems="center" justifyContent="center" minW="90px">
        {!isNaN(delivery.deliveryDistance) ? (Math.round(delivery.deliveryDistance * 100) / 100) : 'D'} (Km)
      </Box>
      <Box display="flex" me="1" alignItems="center" justifyContent="center" minW="100px" >
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
      {
        delivery.deliveryStatus === "onLine" && (
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
        )
      }
      {
        delivery.deliveryStatus === "inDelivery" && (
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
            <Modal isOpen={isOpen} onClose={onClose} setDeliveryCode={setDeliveryCode}>
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
  )
}

export default DeliverymanDelivery