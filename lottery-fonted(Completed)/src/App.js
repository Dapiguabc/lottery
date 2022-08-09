import React, {useEffect} from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import Layout from './Components/Layout';
import { WalletProvider } from './WalletContext';
import Home from './Pages/Home';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <WalletProvider>
        <Layout>
          <Home />
        </Layout>
      </WalletProvider>
    </ChakraProvider>
  );
}

export default App;
