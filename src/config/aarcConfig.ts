import {
  FKConfig,
  ThemeName,
  TransactionSuccessData,
  TransactionErrorData,
  SourceConnectorName,
  DefaultMode,
} from "@aarc-dev/fundkit-web-sdk";
import { APEX_OMNI_ADDRESS, SupportedChainId } from "../constants";

export const aarcConfig: FKConfig = {
  appName: "Apex Omni x Aarc",
  dappId: "apex-omni-deposit", // Required for v4
  userId: "default-user", // Required for v4 - will be updated dynamically with user's address
  headerText: "Fund Your Apex Omni Wallet", // Optional custom header
  defaultMode: DefaultMode.EXCHANGE, // Optional default mode
  module: {
    exchange: {
      enabled: true,
      moduleName: "Exchange", // Optional custom name
      quoteRefreshTime: 60, // Custom refresh time in seconds
    },
    onRamp: {
      enabled: true,
      onRampConfig: {},
      moduleName: "On-Ramp", // Optional custom name
      quoteRefreshTime: 60, // Custom refresh time in seconds
      // Note: refundAddress is not supported in OnRampModule for v4
    },
    bridgeAndSwap: {
      enabled: true,
      fetchOnlyDestinationBalance: false,
      routeType: "Value",
      moduleName: "Bridge & Swap", // Optional custom name
      quoteRefreshTime: 60, // Custom refresh time in seconds
      connectors: [SourceConnectorName.ETHEREUM],
      sourceTokens: [
        {
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
          chainId: 42161,
        }
      ]
    },
    qrPay: {
      enabled: true,
      moduleName: "QR Pay", // Optional custom name
      quoteRefreshTime: 20, // Custom refresh time in seconds
      refundAddress: "0x0000000000000000000000000000000000000000", // Required for v4 - will be updated with user's address
      sourceTokens: [
        {
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
          chainId: 42161,
        }
      ]
    }
  },
  destination: {
    tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum - required for v4
    contract: {
      contractAddress: APEX_OMNI_ADDRESS[SupportedChainId.ARBITRUM],
      contractName: "Apex Omni Deposit",
      contractLogoURI: "https://omni.apex.exchange/favicon.ico?v=1.0.2",
      contractGasLimit: "300000", // Standard gas limit, can be adjusted if needed
      contractPayload: "0x", // Required in v4 - will be updated dynamically with calldataABI and calldataParams
    },
    walletAddress: APEX_OMNI_ADDRESS[SupportedChainId.ARBITRUM],
    chainId: 42161, // Arbitrum chain ID
  },
  appearance: {
    roundness: 42,
    theme: ThemeName.DARK,
  },
  apiKeys: {
    aarcSDK: import.meta.env.VITE_AARC_API_KEY,
  },
  events: {
    onTransactionSuccess: (data: TransactionSuccessData) => {
      console.log("Transaction successful:", data);
    },
    onTransactionError: (data: TransactionErrorData) => {
      console.error("Transaction failed:", data);
    },
    onWidgetClose: () => {
      console.log("Widget closed");
    },
    onWidgetOpen: () => {
      console.log("Widget opened");
    },
  },
  origin: window.location.origin,
}; 