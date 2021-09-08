import { useContext, useEffect, useState } from 'react'
import {
  Badge,
  Box,
  VStack
} from '@chakra-ui/react'
import { DaidTokenContext } from '../App'
import { Web3Context } from 'web3-hooks'

function User() {
  const [web3State] = useContext(Web3Context)
  const daidToken = useContext(DaidTokenContext)
  const roundedBalance = Math.round(web3State.balance * 1000000000) / 1000000000
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)

  useEffect(() => {
    if (daidToken) {
      const getTokenBalance = async () => {
        try {
          setIsLoading(true)
          const getTokenBalance = await daidToken.balanceOf(web3State.account)
          setTokenBalance(Number(getTokenBalance))
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
      const userFilter = daidToken.filters.Transfer(null, web3State.account)
      // ecouter sur l'event DataSet avec le filter eveFilter appliqué
      daidToken.on(userFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        daidToken.off(userFilter, cb)
      }
    }
  }, [setTokenBalance, daidToken, web3State.account])

  return (
    <VStack py="1" align="end">
      <Box>
        {web3State.provider ? <Badge borderRadius="lg" fontSize="14" mb="1" pr="1" pt="1" variant="solid" colorScheme="blue">{roundedBalance} ETH</Badge>
          : <Badge borderRadius="lg" fontSize="14" mb="1" px="2" pt="1" variant="solid" colorScheme="red">{roundedBalance} ETH</Badge>}
      </Box>

      <Box> {web3State.provider ? <Badge borderRadius="lg" fontSize="14" mb="1" pt="1" variant="solid" colorScheme="blue">{tokenBalance} DAID</Badge>
        : <Badge borderRadius="lg" mr="1" px="2" fontSize="14" mb="1" pt="1" variant="solid" colorScheme="red">{tokenBalance} DAID</Badge>}
      </Box>
    </VStack>
  )
}

export default User