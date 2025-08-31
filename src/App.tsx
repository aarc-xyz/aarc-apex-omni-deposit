import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import { AarcFundKitModal } from '@aarc-dev/fundkit-web-sdk';
import { useEffect, useState } from 'react';
import { AarcEthWalletConnector, wagmiConfig } from '@aarc-xyz/eth-connector';
import { aarcConfig } from './config/aarcConfig';
import DepositModal from './components/ApexOmniDepositModal';
import { useAccount } from 'wagmi';

declare global {
  interface Window {
    __VUE__: boolean;
  }
}

const queryClient = new QueryClient();

function App() {
  const [aarcModal, setAarcModal] = useState<AarcFundKitModal | null>(null);
  const { address } = useAccount();

  // Create new modal instance when user connects
  useEffect(() => {
    if (address) {
      const newConfig = {
        ...aarcConfig,
        userId: address,
        module: {
          ...aarcConfig.module,
          qrPay: {
            ...aarcConfig.module.qrPay,
            refundAddress: address // Update refund address with user's address
          }
        }
      };
      const newModal = new AarcFundKitModal(newConfig);
      setAarcModal(newModal);
    } else {
      setAarcModal(null);
    }
  }, [address]);

  if (!aarcModal) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <div className="min-h-screen bg-aarc-bg grid-background flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-2xl font-bold mb-4">Apex Omni x Aarc</h1>
              <p>Please connect your wallet to continue</p>
            </div>
          </div>
        </WagmiProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <AarcEthWalletConnector aarcWebClient={aarcModal} debugLog={true} >
          <DepositModal aarcModal={aarcModal} />
        </AarcEthWalletConnector>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
