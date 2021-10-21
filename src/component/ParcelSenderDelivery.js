import { useContext, useState } from 'react'
import { Random } from 'random-js'
import { utils } from 'ethers'
import axios from 'axios'
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

const ParcelSenderDelivery = (props) => {

  const { delivery, senderFirstName, senderLastName, selectedId, setSelectedId } = props

  const fastDeliveryNft = useContext(FastDeliveryNftContext)
  const { isOpen: isPickUpOpen, onOpen: onPickUpOpen, onClose: onPickUpClose } = useDisclosure()
  const { isOpen: isDelOpen, onOpen: onDelOpen, onClose: onDelClose } = useDisclosure()
  const toast = useToast()
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars



  // Pick up delivery function
  const handleClickPickUp = async (index) => {

    // Randomize deliveryCode and hash
    const random = new Random(); // uses the nativeMath engine
    const deliveryCode = random.integer(1000, 9999)
    let deliveryCodeHash = utils.keccak256(utils.toUtf8Bytes(deliveryCode.toString()))

    // email request
    const emailRequest = async () => {
      let urlServer = process.env.REACT_APP_URL_SERVER
      let email = "dad.savel@gmail.com"
      let message = `${senderFirstName} ${senderLastName} send you a parcel\n The delivery code for retreiving parcel is : ${deliveryCode}`
      const response = await axios.post(`${urlServer}/access`, { email: email, message: message })
      if (response.status === 'success') {
        alert("Message Sent.");
        this.resetForm()
      } else if (response.status === 'fail') {
        alert("Message failed to send.")
      }
    }
    try {
      setIsLoading(true)
      let tx = await fastDeliveryNft.collectDelivery(index, deliveryCodeHash)
      await tx.wait()
      await emailRequest()
      toast({
        title: 'Confirmed transaction : Pick up Delivery has been confirmed \nInfo email send to Recipient with delivery code',
        description: `Transaction hash: ${tx.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (e) {
      if (e.code) {
        console.log(e)
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

  const handleClickDel = async (index) => {
    try {
      setIsLoading(true)
      console.log(index, "deleted id")
      let tx = await fastDeliveryNft.deleteDelivery(index)
      await tx.wait()

      toast({
        title: `Confirmed transaction : Delivery id ${index} has been deleted`,
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


  return (
    <Flex h="auto" wrap="wrap">
      <Box display="flex" alignItems="center" justifyContent="center" bg="gray.200" w="25px" me="1" px="1" > {delivery.id}</Box>
      <Box display="flex" me="1" bg="blue.300">
        <Popover isLazy trigger="hover" >
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
      <Box display="flex" me="1" bg="teal.300">
        <Popover isLazy trigger="hover" >
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
      <Box display="flex" borderRight="1px" me="1" alignItems="center" justifyContent="center" minW="110px">
        {delivery.deliveryDistance} (Km)
      </Box>
      <Box display="flex" me="1" alignItems="center" justifyContent="center" minW="110px" >
        {delivery.deliveryAmount} (DAID)
      </Box>
      <Box display="flex" me="1" bg="red.300">
        <Popover isLazy trigger="hover" >
          <PopoverTrigger>
            <Box display="flex" flex="1" alignItems="center" minW="155px" justifyContent="center" h="100%">
              {delivery.deliverymanCompany}</Box>
          </PopoverTrigger>
          <PopoverContent mx="1">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>{delivery.deliverymanCompany === "-" ? "Delivery not Attributed" : delivery.deliverymanCompany}</PopoverBody>
            <PopoverBody>M. {delivery.deliverymanManagerName}</PopoverBody>
            <PopoverBody>{delivery.deliverymanAddress}</PopoverBody>
            <PopoverBody>{delivery.deliverymanTel}</PopoverBody>
            <PopoverBody>{delivery.deliverymanMail}</PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      <Popover isLazy trigger="hover" >
        <PopoverTrigger>
          <Box display="flex" flex="1" alignItems="center" justifyContent="center" bg="orange.200" minW="100x">
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
          <>
            <Button
              mx="1"
              my="1"
              pt="1"
              size="xs"
              borderRadius="lg"
              colorScheme="red"
              type="button"
              onClick={() => {
                onDelOpen()
                setSelectedId(Number(delivery.id))
              }
              }>X</Button>
            <Modal isOpen={isDelOpen} onClose={onDelClose}>
              <ModalContent>
                <ModalHeader>Delete </ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                  <Text>Do you want to confirm the removal of the delivery ID: {(selectedId)}?</Text>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onDelClose}>
                    Close
                  </Button>
                  <Button
                    colorScheme="red"
                    mr={3}
                    onClick={() => {
                      onDelClose()
                      handleClickDel(selectedId)
                    }}
                    variant="ghost">Del</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
      }
      {
        delivery.deliveryStatus === "attributed" && (
          <>
            <Button
              mx="1"
              my="1"
              pt="1"
              size="xs"
              borderRadius="lg"
              colorScheme="blue"
              type="button"
              onClick={() => {
                onPickUpOpen()
                setSelectedId(Number(delivery.id))
              }
              }>Pick up</Button>
            <Modal isOpen={isPickUpOpen} onClose={onPickUpClose}>
              <ModalContent>
                <ModalHeader>Pick up delivery confirmation</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                  <Text>Do you want to confirm the pickup for delivery ID: {(selectedId)}?</Text>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onPickUpClose}>
                    Close
                  </Button>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onPickUpClose()
                      handleClickPickUp(selectedId)
                    }}
                    variant="ghost">Ok</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
      }
    </Flex>
  )
}

export default ParcelSenderDelivery
