import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

import {
  HStack,
  Spacer,
  Flex,
  Grid,
  GridItem,
  Button,
  Heading,
  useToast,
  Text,
  AvatarBadge,
  Avatar,
  Box,
} from '@chakra-ui/react';
import { Logo } from '../Logo';
import { useWalletState } from '../WalletContext';
import { Network, AppInfo} from '../Constant';
import { formatAccount } from '../helper';

const Layout = ({ children }) => {

    const [wallet, setWallet] = useWalletState();
    const toast = useToast();
    // const blockServericeWS = io(`ws://${Network[process.env.NODE_ENV].blockService}`);
    // There is a CORS issue Because the block service of testnet is a third-party service.
    // So we need to proxy this service in setupProxy.js. Or you can host a block service of your own. 
    // const blockServericeWS = io(`ws://${Network[process.env.NODE_ENV].blockService}`);
    //const blockServericeWS = process.env.NODE_ENV === 'production'? io(`ws://${Network[process.env.NODE_ENV].blockService}`) : io();

    const connect = () => {
        // To be done
    }

    const disconnect = () => {
        // To be done
    }

    const handleWalletConnect = (response) => {
        console.log(response)
    }

    const handleWalletInfo = (response) => {
        // To be done
    }

    useEffect(() => {
        // To be done
    }, [])

    // useEffect(() => {
    //     blockServericeWS.emit('join', `currency.balances.${wallet.account}`)
    //     blockServericeWS.on("connect", () => {
    //         console.log('success');
    //     });
    //     return () => {
    //         blockServericeWS.emit('leave', `currency.balances.${wallet.account}`)
    //         blockServericeWS.offAny()
    //     }
    // }, [])

    return (
        <Grid
        h='100vh'
        gridTemplateRows={'55px 1fr'}>
            <GridItem pl='4' pr='4' borderBottomWidth='1px'>
                <Flex h='100%' alignItems='center'>
                    <HStack>
                    <Logo boxSize='28px'/>
                    <Heading as='h3' size='lg'>Lottery</Heading>
                    </HStack>
                    <Spacer />        
                    {
                        wallet.connected? 
                        <HStack>
                            <Box>
                                <Avatar size='sm' src='https://semantic-ui.com/images/avatar2/large/elyse.png'>
                                    <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1.25em'/>
                                </Avatar>
                            </Box>
                            <Heading size='sm' bg='teal.100' px='2' py='1' rounded='full' color='purple'>{formatAccount(wallet.account)}</Heading>
                            <Button colorScheme='purple' onClick={disconnect}>Disconnect</Button>
                        </HStack>
                        : 
                        <Button colorScheme='purple' onClick={connect}>Connect</Button>}   
                </Flex>
            </GridItem>
            <GridItem>
                {children}
            </GridItem>
        </Grid>
    )
}

export default Layout;