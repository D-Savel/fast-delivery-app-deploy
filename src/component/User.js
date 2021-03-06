import { useContext, useEffect, useState } from 'react'
import {
  Badge,
  Box,
  VStack,
  Spacer
} from '@chakra-ui/react'
import { DaidTokenContext } from '../App'
import { Web3Context } from 'web3-hooks'
import { ethers } from 'ethers'

function User() {
  const [web3State] = useContext(Web3Context)
  const daidToken = useContext(DaidTokenContext)
  const roundedEtherBalance = Math.round(web3State.balance * 10000000) / 10000000
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(ethers.utils.parseEther('0'))

  useEffect(() => {
    if (daidToken) {
      const getTokenBalance = async () => {
        try {
          setIsLoading(true)
          const _tokenBalance = await daidToken.balanceOf(web3State.account)
          const tokenBalance = ethers.utils.formatEther(_tokenBalance)
          setTokenBalance(tokenBalance)
        } catch (e) {
          console.log(e)
        } finally {
          setIsLoading(false)
        }
      }
      const cb = (from, to, tokenId) => {
        getTokenBalance()
      }
      getTokenBalance()
      const senderFilter = daidToken.filters.Transfer(web3State.account)
      const recipientFilter = daidToken.filters.Transfer(null, web3State.account)
      // ecouter sur l'event Transfer
      daidToken.on(senderFilter, cb)
      daidToken.on(recipientFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        daidToken.off(senderFilter, cb)
        daidToken.off(recipientFilter, cb)
      }
    }
  }, [setTokenBalance, daidToken, web3State.account, tokenBalance])

  return (
    <VStack py="1" alignItems="end">
      <Box>
        {web3State.provider ? <Badge borderRadius="lg" fontSize="14" mb="1" pr="1" pt="1" variant="solid" colorScheme="blue">{roundedEtherBalance} Eth</Badge>
          : <Badge borderRadius="lg" fontSize="14" mb="1" px="2" pt="1" variant="solid" colorScheme="red">{roundedEtherBalance} Eth</Badge>}
      </Box>
      <Spacer />
      <Box> {web3State.provider ? <Badge borderRadius="lg" fontSize="14" mb="1" pt="1" variant="solid" colorScheme="blue">{Number(tokenBalance)} DAID</Badge>
        : <Badge borderRadius="lg" mr="1" px="2" fontSize="14" mb="1" pt="1" variant="solid" colorScheme="red">{Number(tokenBalance)} DAID</Badge>}
      </Box>
    </VStack>
  )
}

export default User