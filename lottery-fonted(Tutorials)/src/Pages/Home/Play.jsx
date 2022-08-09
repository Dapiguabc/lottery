import React, { useState, useEffect, useMemo, useRef } from "react";
import { ArrowBackIcon, SunIcon }  from "@chakra-ui/icons";
import { LotteryMap, Network } from "../../Constant";
import BigNumber from "bignumber.js";
import { 
    Box, 
    Heading, 
    Flex, 
    Image, 
    VStack, 
    Text, 
    SimpleGrid, 
    Button, 
    IconButton, 
    Divider, 
    Grid, 
    GridItem,
    Select,
    HStack,
    Input,
    useNumberInput,
    Slider,
    SliderThumb,
    SliderTrack,
    SliderFilledTrack,
    Tooltip,
    useToast
} from "@chakra-ui/react";
import { useWalletState } from '../../WalletContext';
import { formatMoney, getVariable, getAllVariable, changeTimeZone } from "../../helper";


const contract = Network[process.env.NODE_ENV].contractName
const currencySymbol = Network[process.env.NODE_ENV].currencySymbol
const networkType = Network[process.env.NODE_ENV].networkType

const DrawCard = (props) => {

    const minBuyAmount = 10
    const maxBuyAmount = 1000

    const toast = useToast()

    const uid = useRef()
    const [txPending, setTxPending] = useState(false)
    const [amountValue, setAmountValue] = useState(minBuyAmount)
    const [showTooltip, setShowTooltip] = useState(false)
    const [showCover, setShowCover] = useState(true)
    const [leftTime, setLeftTime] = useState([0,0,0,0])
    const [selectedFruit, setSelectedFruit] = useState('Banana')
    const [wallet, setWallet] = useWalletState()
    const [currentRound, setCurrentRound] = useState(1)
    const [round, setRound] = useState({
        roundNumber: 1,
        startTime: new Date(1970,1,1,0,0,0,0).toLocaleString(),
        endTime: new Date(1970,1,1,0,0,0,0).toLocaleString(),
        status: "Starting",
        betInfo: {
            "Banana": [], 
            "Grape":[],
            "Lemon":[],
            "Orange":[],
            "Peach":[],
            "Pineapple":[]
        },
        statistics: {
            restPrize: 0,
            totalBetAmount: 0,
            Banana: 0, 
            Grape: 0,
            Lemon: 0,
            Orange: 0,
            Peach: 0,
            Pineapple: 0
        }
    })

    const { getInputProps } = useNumberInput({
        defaultValue: 10,
        min: minBuyAmount,
        max: maxBuyAmount,
        precision: 0,
        inputMode: "numeric"
    })
    const input = getInputProps()

    const showCardBack = () => {
        setShowCover(false)
    }

    const showCardCover = () => {
        setShowCover(true)
    }

    const buyTicket = () => {
        // To be done
    }

    useEffect(() => {
        const countDownTime = () => {
            let now = new Date()
            let end = changeTimeZone(round.endTime)
    
            let lefttime = end.getTime() - now.getTime(),
            d = Math.round(lefttime/(1000*60*60*24)), 
            h = Math.round(lefttime/(1000*60*60)%24), 
            m = Math.round(lefttime/(1000*60)%60),
            s = Math.round(lefttime/1000%60)

            setLeftTime([d, h, m, s])
        }

        const interval = setInterval(countDownTime, 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, [round.endTime]);

    
    const totalPrize = useMemo(() => {
        let result = new BigNumber(round.statistics.restPrize).plus(round.statistics.totalBetAmount)
        return result.toString()
    },[round.statistics.restPrize, round.statistics.totalBetAmount])

    const CardCover = (
        <Box 
            bg='white' 
            w='100%' 
            h='100%'
            transform= {showCover? 'rotatey(0)' : 'rotatey(-180deg)'}
            position='absolute'
            shadow='md' 
            overflow='hidden'
            borderRadius='lg'
            transition='transform 0.5s ease-in-out'
            style={{backfaceVisibility: 'hidden' }} 
        >
            <Flex color='white' px={5} py={2} justifyContent='space-between' alignItems='baseline' bg='purple.600'>
                <Heading fontSize='lg'>
                    Next Draw
                    <Text ml='2' as='span' fontSize='md' color='yellow.400'>{`${leftTime[0]}d ${leftTime[1]}h ${leftTime[2]}m ${leftTime[3]}s`}</Text>
                </Heading>
                <Heading fontSize='sm'>#{currentRound}</Heading>
            </Flex>
            <VStack p={5}>
                <SimpleGrid w='100%' columns={3} spacing={4}>
                    <VStack>
                        <Image boxSize='36px' objectFit='cover' src='https://twemoji.maxcdn.com/v/latest/svg/1f34c.svg' alt='🍌'/>
                        <Text fontWeight='bold' color='tomato'>{formatMoney(round.statistics.Banana).split('.')[0]}</Text>
                    </VStack>
                    <VStack>
                        <Image boxSize='36px' objectFit='cover' src='https://twemoji.maxcdn.com/v/latest/svg/1f347.svg' alt='🍇'/>
                        <Text fontWeight='bold' color='tomato'>{formatMoney(round.statistics.Grape).split('.')[0]}</Text>
                    </VStack>
                    <VStack>
                        <Image boxSize='36px' objectFit='cover' src='https://twemoji.maxcdn.com/v/latest/svg/1f34b.svg' alt='🍋'/>
                        <Text fontWeight='bold' color='tomato'>{formatMoney(round.statistics.Lemon).split('.')[0]}</Text>
                    </VStack>
                    <VStack>
                        <Image boxSize='36px' objectFit='cover' src='https://twemoji.maxcdn.com/v/latest/svg/1f34a.svg' alt='🍊'/>
                        <Text fontWeight='bold' color='tomato'>{formatMoney(round.statistics.Orange).split('.')[0]}</Text>
                    </VStack>
                    <VStack>
                        <Image boxSize='36px' objectFit='cover' src='https://twemoji.maxcdn.com/v/latest/svg/1f351.svg' alt='🍑'/>
                        <Text fontWeight='bold' color='tomato'>{formatMoney(round.statistics.Peach).split('.')[0]}</Text>
                    </VStack>
                    <VStack>
                        <Image boxSize='36px' objectFit='cover' src='https://twemoji.maxcdn.com/v/latest/svg/1f34d.svg' alt='🍍'/>
                        <Text fontWeight='bold' color='tomato'>{formatMoney(round.statistics.Pineapple).split('.')[0]}</Text>
                    </VStack>
                </SimpleGrid>
                <Divider />
                <Grid w='100%'>
                    <GridItem h='10' textAlign='left'>
                        <Text verticalAlign='middle' fontSize='md' fontWeight='bold' as='span' mr='4'>Total Prizes:</Text>
                        <Text verticalAlign='middle' fontSize='lg' as='span' fontWeight='bold' bgClip='text' color='purple.600'>{totalPrize} {currencySymbol}</Text>
                    </GridItem>
                    <GridItem h='10' textAlign='left'>
                        <Text verticalAlign='middle' fontSize='md' fontWeight='bold' as='span' mr='4'>End Date:</Text> 
                        <Text verticalAlign='middle' as='span'fontWeight='bold' color='purple.600'>{round.endTime}</Text>
                    </GridItem >
                </Grid>
                <Button colorScheme='purple' size='md' width='100%' onClick={showCardBack}>Buy Tickets</Button>
            </VStack>
        </Box>
    )

    const CardBack = (
        <Box 
            transform={showCover? 'rotatey(-180deg)' : 'rotatey(0)'} 
            bg='white' 
            position='absolute'
            w='100%'
            h='100%'
            shadow='md' 
            overflow='hidden'
            borderRadius='lg' 
            transition='transform 0.5s ease-in-out'
            style={{backfaceVisibility: 'hidden'}} 
        >
            <Flex color='white' px={5} py={2}  alignItems='center' bg='purple.600'>
                <IconButton
                    mr='4'
                    minW='none'
                    color='white'
                    variant='link'
                    size='lg'
                    icon={<ArrowBackIcon />}
                    onClick={showCardCover}
                />
                <Heading fontSize='lg'>
                    Buy Tickets
                </Heading>
            </Flex>
            <VStack p={5} spacing={4}>
                <Box w='100%'>
                    <HStack mb={2}>
                        <Divider h={4} borderColor='purple.600' borderLeftWidth='2px' orientation='vertical'/>
                        <Text>Ticket</Text>
                    </HStack>
                    <HStack>
                        <Select mr={4} borderColor="purple.100" focusBorderColor="purple.600" value={selectedFruit} onChange={(e) => setSelectedFruit(e.target.value)}>
                            <option value='Banana'>Banana</option> 
                            <option value='Grape'>Grape</option>
                            <option value='Lemon'>Lemon</option>
                            <option value='Orange'>Orange</option> 
                            <option value='Peach'>Peach</option>
                            <option value='Pineapple'>Pineapple</option>
                        </Select>
                        <Image boxSize='36px' objectFit='cover' src={LotteryMap[selectedFruit].img} alt={LotteryMap[selectedFruit].emoji}/>
                    </HStack>
                </Box>
                <Box w='100%'>
                    <HStack mb={2}>
                        <Divider h={4} borderColor='purple.600' borderLeftWidth='2px' orientation='vertical'/>
                        <Text>Amount</Text>
                    </HStack>
                    <Input 
                        {...input} 
                        focusBorderColor="purple.600" 
                        borderColor="purple.100"
                        value={amountValue}
                        onChange={(e) => {
                            if (e.target.value > maxBuyAmount) {
                                if (maxBuyAmount > wallet.tauBalance) {
                                    setAmountValue(wallet.tauBalance)
                                } else {
                                    setAmountValue(maxBuyAmount)
                                }
                            } else {
                                setAmountValue(e.target.value)
                            }
                        }} 
                    />
                    <Text mt='2' fontSize='sm' color='purple.200' textAlign='right'>{`Balance: ${formatMoney(wallet.tauBalance)} ${currencySymbol}`}</Text>
                    <Slider 
                        mt='2' 
                        mb={4}
                        value={amountValue}
                        focusThumbOnChange={false}
                        max={wallet.tauBalance === 0? 100 : wallet.tauBalance}
                        onChange={(v) => setAmountValue(v)}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}>
                        <SliderTrack bg='purple.100'>
                            <SliderFilledTrack bg='purple.600' />
                        </SliderTrack>
                        <Tooltip
                            hasArrow
                            bg='purple.500'
                            color='white'
                            placement='top'
                            isOpen={showTooltip}
                            label={amountValue}
                        >        
                            <SliderThumb boxSize={6}>
                                <Box color='purple.600' as={SunIcon} />
                            </SliderThumb>
                        </Tooltip>
                    </Slider>
                </Box>
                <Button 
                    colorScheme='purple' 
                    size='md' 
                    width='100%' 
                    isLoading={txPending}
                    loadingText='Pending'
                    disabled={wallet.tauBalance < minBuyAmount || txPending ? true : false}
                    onClick={buyTicket}
                >
                    {wallet.tauBalance < minBuyAmount ? 'Insufficient Coins' : 'Confirm'}
                </Button>
            </VStack>
        </Box>
    )

    return (
        <Box w='sm' h='376px' position='relative' style={{ perspective: '1000px' }} {...props}>
            {CardCover}
            {CardBack}
        </Box>
    )
}


const Play = () => {

    return (
        <VStack bg='purple.400' p={4} h='100%'>
            <Heading fontSize='4xl' color='white' my={10}>Get your tickets now!</Heading>
            <DrawCard />
        </VStack>
    )
}

export default Play;