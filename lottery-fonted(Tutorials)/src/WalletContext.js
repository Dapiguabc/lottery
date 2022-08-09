import React, { useState, useContext } from 'react';

const WalletContext = React.createContext(undefined);

export const WalletProvider = ( { children } ) => {

  const [wallet, setWallet] = useState({
    connected: false,
    locked: true,
    tauBalance: 0,
    account: null,
  });

  return (
    <WalletContext.Provider value={[wallet, setWallet]}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletState = () => {
  const context = useContext(WalletContext);
  return context;
}