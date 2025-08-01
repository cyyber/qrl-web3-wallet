import {
  JsonRpcRequest,
  providerErrors,
  rpcErrors,
} from "@theqrl/zond-wallet-provider";
import { RESTRICTED_METHODS } from "../constants/requestConstants";
import StorageUtil from "@/utilities/storageUtil";
import { MAX_SAFE_CHAIN_ID } from "@/constants/blockchain";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";

const getFromAddress = (req: JsonRpcRequest<JsonRpcRequest>) => {
  switch (req.method) {
    case RESTRICTED_METHODS.ZOND_SEND_TRANSACTION:
      // @ts-ignore
      return req.params?.[0]?.from ?? "";
    case RESTRICTED_METHODS.ZOND_SIGN_TYPED_DATA_V4:
      // @ts-ignore
      return req.params?.[0];
    case RESTRICTED_METHODS.PERSONAL_SIGN:
      // @ts-ignore
      return req.params?.[1];
  }
};

export const checkAccountHasBeenAuthorized = async (
  req: JsonRpcRequest<JsonRpcRequest>,
) => {
  const fromAddress = getFromAddress(req);
  const urlOrigin = new URL(req?.senderData?.url ?? "").origin;
  const connectedAccounts =
    await StorageUtil.getDAppsConnectedAccountsData(urlOrigin);
  const hasAddressConnected =
    connectedAccounts?.accounts.includes(fromAddress) ?? false;
  return {
    canProceed: hasAddressConnected,
    proceedError: providerErrors.unauthorized({
      message: `The requested account ${fromAddress} has not been authorized by the user.`,
    }),
  };
};

const isAcceptableUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);

    if (
      url === null ||
      url.hostname.length === 0 ||
      url.pathname.length === 0 ||
      url.hostname !== decodeURIComponent(url.hostname)
    ) {
      return false;
    }

    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.protocol === "https:"
    );
  } catch (error) {
    return false;
  }
};

export const checkWalletAddZondChainParams = async (
  req: JsonRpcRequest<JsonRpcRequest>,
) => {
  const params = req.params;
  // @ts-ignore
  const chainData: BlockchainDataType = params?.[0];

  if (!params || typeof params !== "object") {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Expected an object parameter. Received: ${JSON.stringify(
          params,
        )}`,
      }),
    };
  }

  const chainId = chainData?.chainId;
  if (
    typeof chainId !== "string" ||
    !/^0x[1-9a-f]+[0-9a-f]*$/iu.test(chainId.toLowerCase())
  ) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Expected 0x-prefixed, unpadded, non-zero hexadecimal string 'chainId'. Received: ${chainId}`,
      }),
    };
  }
  const chainIdNumber = parseInt(chainId, 16);
  if (
    !Number.isSafeInteger(chainIdNumber) ||
    chainIdNumber < 0 ||
    chainIdNumber > MAX_SAFE_CHAIN_ID
  ) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Invalid chain ID "${chainId}": numerical value should be in the inclusive range of 0 and ${MAX_SAFE_CHAIN_ID}. Received: ${chainId}`,
      }),
    };
  }

  const chainName = chainData?.chainName;
  if (typeof chainName !== "string" || !chainName) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Expected non-empty string 'chainName'. Received: ${chainName}`,
      }),
    };
  }

  const rpcUrls = chainData?.rpcUrls;
  if (
    !rpcUrls ||
    !Array.isArray(rpcUrls) ||
    rpcUrls.length === 0 ||
    !rpcUrls.find((rpcUrl) => isAcceptableUrl(rpcUrl))
  ) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Expected an array with at least one valid string HTTPS url 'rpcUrls', Received: ${rpcUrls}`,
      }),
    };
  }

  const nativeCurrency = chainData?.nativeCurrency;
  if (nativeCurrency !== null) {
    if (typeof nativeCurrency !== "object" || Array.isArray(nativeCurrency)) {
      return {
        canProceed: false,
        proceedError: rpcErrors.invalidParams({
          message: `Expected null or object 'nativeCurrency'. Received: ${nativeCurrency}`,
        }),
      };
    }
    if (nativeCurrency.decimals !== 18) {
      return {
        canProceed: false,
        proceedError: rpcErrors.invalidParams({
          message: `Expected the number 18 for 'nativeCurrency.decimals' when 'nativeCurrency' is provided. Received: ${nativeCurrency.decimals}`,
        }),
      };
    }
    if (!nativeCurrency.symbol || typeof nativeCurrency.symbol !== "string") {
      return {
        canProceed: false,
        proceedError: rpcErrors.invalidParams({
          message: `Expected a string 'nativeCurrency.symbol'. Received: ${nativeCurrency.symbol}`,
        }),
      };
    }
  }
  const ticker = nativeCurrency?.symbol;
  if (
    ticker &&
    (typeof ticker !== "string" || ticker.length < 1 || ticker.length > 6)
  ) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Expected 1-6 character string 'nativeCurrency.symbol'. Received: ${ticker}`,
      }),
    };
  }

  const blockchains = await StorageUtil.getAllBlockChains();
  const existingChain = blockchains.find((chain) => chain.chainId === chainId);
  if (existingChain && existingChain?.nativeCurrency?.symbol !== ticker) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `nativeCurrency.symbol does not match currency symbol for a network the user already has added with the same chainId. Received: ${ticker}`,
      }),
    };
  }

  return {
    canProceed: true,
    proceedError: undefined,
  };
};
