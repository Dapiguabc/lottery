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
        const detail = JSON.stringify({
            appName: AppInfo.appName, // dapp name
            version: AppInfo.version, // dapp verision
            logo: AppInfo.logo, // dapp logo
            contractName: Network[process.env.NODE_ENV].contractName, // the contract name you create at tutorial "Write Lottery Contract" 
            networkType: Network[process.env.NODE_ENV].networkType, // Network type
        })
    
        // Dispatch connection event
        document.dispatchEvent(new CustomEvent('lamdenWalletConnect', {detail}));
    }

    const disconnect = () => {
        setWallet({
            connected: false,
            locked: true,
            tauBalance: 0,
            address: null,
        })
    }

    const handleWalletInfo = (response) => {
        if (response.detail.errors){
            // If an error occurs, a pop-up window will appear
            toast({
                title: 'Wallet Error',
                description: response.detail.errors[0],
                status: 'error',
                duration: 9000,
                position: 'top',
                isClosable: true,
            });
            return;
        } else {
            let locked = response.detail.locked;
            let account = !locked && response.detail.wallets.length > 0 ? response.detail.wallets[0] : null;
            // account: Wallet account
            // locked: Whether the Lamden Vault is locked
            // connected: Whether connection is successful
            setWallet({
                ...wallet,
                locked,
                account,
                connected: account ? true : false,
            })
        }
    }

    useEffect(() => {
        document.addEventListener('lamdenWalletInfo', handleWalletInfo);
        return () => {
            document.removeEventListener('lamdenWalletInfo', handleWalletInfo);
        }
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