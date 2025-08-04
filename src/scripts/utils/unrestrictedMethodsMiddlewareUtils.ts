import { MAX_SAFE_CHAIN_ID } from "@/constants/blockchain";
import StorageUtil from "@/utilities/storageUtil";
import { providerErrors, rpcErrors } from "@theqrl/zond-wallet-provider";
import { RESTRICTED_METHODS } from "../constants/requestConstants";

export const checkWalletSwitchZondChainParams = async (paramObject: {
  chainId: string;
}) => {
  if (!paramObject || typeof paramObject !== "object") {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Expected single, object parameter. Received: ${JSON.stringify(
          paramObject,
        )}`,
      }),
    };
  }

  const allowedKeys = ["chainId"];
  const extraKeys = Object.keys(paramObject).filter((key) => {
    return !allowedKeys.includes(key);
  });
  if (extraKeys.length) {
    return {
      canProceed: false,
      proceedError: rpcErrors.invalidParams({
        message: `Received unexpected keys on object parameter. Unsupported keys: ${extraKeys}`,
      }),
    };
  }

  const chainId = paramObject?.chainId;
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

  const blockchains = await StorageUtil.getAllBlockChains();
  const existingChain = blockchains.find(
    (chain) => chain.chainId.toLowerCase() === chainId.toLowerCase(),
  );
  if (!existingChain) {
    return {
      canProceed: false,
      proceedError: providerErrors.custom({
        code: 4902,
        message: `Unrecognized chain ID "${chainId}". Try adding the chain using ${RESTRICTED_METHODS.WALLET_ADD_ZOND_CHAIN} first.`,
      }),
    };
  }

  return {
    canProceed: true,
    proceedError: undefined,
  };
};
