const ZOND_MAINNET_DATA = {
  chainId: "0x1",
  chainName: "Zond Mainnet",
  rpcUrls: ["http://127.0.0.1:8545"],
  blockExplorerUrls: ["https://www.theqrl.org/markets/"],
  nativeCurrency: {
    name: "Quanta",
    symbol: "ZND",
    decimals: 18,
  },
  iconUrls: ["https://www.theqrl.org/img/icons/qrl-logo.svg"],
};

const ZOND_TESTNET_DATA = {
  chainId: "0x7e7e",
  chainName: "Zond Testnet",
  rpcUrls: ["http://209.250.255.226:8545"],
  blockExplorerUrls: ["https://www.theqrl.org/markets/"],
  nativeCurrency: {
    name: "Quanta",
    symbol: "ZND",
    decimals: 18,
  },
  iconUrls: ["https://www.theqrl.org/img/icons/qrl-logo.svg"],
};

export type BlockchainDataType = typeof ZOND_MAINNET_DATA & {
  defaultRpcUrl: string;
  defaultBlockExplorerUrl: string;
  defaultIconUrl: string;
  isTestnet: boolean;
  defaultWsRpcUrl: string;
};

export const ZOND_BLOCKCHAINS: BlockchainDataType[] = [
  {
    ...ZOND_MAINNET_DATA,
    defaultRpcUrl: ZOND_MAINNET_DATA.rpcUrls[0],
    defaultBlockExplorerUrl: ZOND_MAINNET_DATA.blockExplorerUrls[0],
    defaultIconUrl: ZOND_MAINNET_DATA.iconUrls[0],
    isTestnet: false,
    defaultWsRpcUrl: "http://localhost:3000",
  },
  {
    ...ZOND_TESTNET_DATA,
    defaultRpcUrl: ZOND_TESTNET_DATA.rpcUrls[0],
    defaultBlockExplorerUrl: ZOND_TESTNET_DATA.blockExplorerUrls[0],
    defaultIconUrl: ZOND_TESTNET_DATA.iconUrls[0],
    isTestnet: true,
    defaultWsRpcUrl: "http://localhost:3000",
  },
];

export const DEFAULT_BLOCKCHAIN = ZOND_BLOCKCHAINS[0];
