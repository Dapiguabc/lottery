import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
    Box, 
    Text,
    VStack,
    Image,
    Button,
    Grid,
    GridItem,
    HStack,
    Divider,
    Heading,
    useToast
} from "@chakra-ui/react";
import { formatMoney, getVariable, getAllVariable, changeTimeZone } from "../../helper";
import { LotteryMap, Network } from "../../Constant";
import { useWalletState } from '../../WalletContext';
import BigNumber from "bignumber.js";

const contract = Network[process.env.NODE_ENV].contractName
const currencySymbol = Network[process.env.NODE_ENV].currencySymbol
const networkType = Network[process.env.NODE_ENV].networkType

const Round = ({data}) => {

    console.log(data)
    const uid = useRef()
    const [fold, setFold] = useState(true)
    const [txPending, setTxPending] = useState(false)
    const [wallet, setWallet] = useWalletState()
    const toast =  useToast()

    const claimDisable = useMemo(() => {
        let disable = data.status !== "Ended" 
                        || new BigNumber(data.betInfo[data.winTicket]).comparedTo(0) !== 1
                        || (data[wallet.account] && data[wallet.account].claimed)

        return disable
    }, [wallet.account])

    const calcBouns = () => {
        if (data.status === "Ended") {
            const winAmount = data.betInfo[data.winTicket].__fixed__ || data.betInfo[data.winTicket]
            const winnerBetAmount = data.winnerBetAmount.__fixed__ || data.winnerBetAmount
            const totalAwards = data.totalAwards.__fixed__ || data.totalAwards
            if (winAmount === 0 ||  winAmount === '0') {
                return 0 + ' ' + currencySymbol
            } else {
                return formatMoney(new BigNumber(winAmount).div(winnerBetAmount).times(totalAwards)) + ' ' + currencySymbol
            }
        } else {
            return 'Waiting for the lottery result'
        }
    }

    const claimBonus = () => {
        // to be done
    }

    return (
        <Box>
            <Grid templateColumns='repeat(8, 1fr)' gap={6} shadow='sm' p='4' alignItems='center' key={data.id}>
                <GridItem>
                    <VStack>
                        <Text>Round</Text>
                        <Text fontWeight='bold' color='purple.600'>#{data.id}</Text>
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack>
                        <Text>Start Time</Text>
                        <Text fontWeight='bold' color='purple.600'>{data.startTime}</Text>
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack>
                        <Text>End Time</Text>
                        <Text fontWeight='bold' color='purple.600'>{data.endTime}</Text>
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack>
                        <Text>Status</Text>
                        <Text fontWeight='bold' color='purple.600'>{data.status === "Ended" ? "Ended" : "Not Ended"}</Text>
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack>
                        <Text>Result</Text>
                        {data.status === "Ended" ? <Image boxSize='24px' objectFit='cover' src={LotteryMap[data.winTicket].img} alt={LotteryMap[data.winTicket].emoji} /> : <Text fontWeight='bold' color='purple.600'>----</Text>}
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack>
                        <Text>Total Prize</Text>
                        <Text fontWeight='bold' color='purple.600'>{data.status === "Ended" ? `${formatMoney(data.totalAwards.__fixed__ || data.totalAwards).split('.')[0]} ${currencySymbol}` : "----"}</Text>
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack>
                        <Text>Claimed</Text>
                        <Text fontWeight='bold' color='purple.600'>{data[wallet.account] && data[wallet.account].claimed ? 'True' : 'False'}</Text>
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack w='72px'>
                        <Button size='sm' w='100%' colorScheme='teal' onClick={() => setFold(v => !v)}>Details</Button>
                        <Button size='sm' w='100%' colorScheme='purple' disabled={claimDisable} isLoading={txPending} onClick={claimBonus}>Claim</Button>
                    </VStack>
                </GridItem>
            </Grid>
            <Box hidden={fold} ml={14} py={8}>
                <HStack mb={2}>
                        <Divider h={4} borderColor='purple.600' borderLeftWidth='2px' orientation='vertical'/>
                        <Text fontWeight='bold'>Your Tickets</Text>
                </HStack>
                <HStack spacing={24}>
                    {
                        Object.keys(data.betInfo).map(key => (
                            <VStack key={key}>
                                <Image boxSize='36px' objectFit='cover' src={LotteryMap[key].img} alt={LotteryMap[key].emoji} />
                                <Text fontWeight='bold' color='tomato'>{formatMoney(data.betInfo[key]).split('.')[0]}</Text>
                            </VStack>
                        ))
                    }
                </HStack>
                <HStack my={8}>
                        <Divider h={4} borderColor='purple.600' borderLeftWidth='2px' orientation='vertical'/>
                        <Text fontWeight='bold'>Your Bonus</Text>
                </HStack>
                <Heading textAlign='left' color='tomato' fontSize='xl'>
                    {calcBouns()}
                </Heading>
            </Box>
        </Box>
    )
}

const Claim = () => {

    const [userRounds, setUserRounds] = useState([])
    const [betInfo, setBetInfo] = useState([])
    const [wallet] = useWalletState()

    const roundList = useMemo(() => {
        return betInfo.map(item => <Round key={item.id} data={item} />) 
    }, [betInfo])

    return (
        <VStack bg='gray.100' p={4} h='100%'>
            <Box mt='100' bg='white' borderRadius='lg' shadow='lg'>
                {roundList}
            </Box>
        </VStack>
    )
}

export default Claim;