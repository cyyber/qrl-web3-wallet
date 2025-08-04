import { JsonRpcMiddleware } from "@theqrl/zond-wallet-provider/json-rpc-engine";
import { providerErrors } from "@theqrl/zond-wallet-provider/rpc-errors";
import { Json, JsonRpcRequest } from "@theqrl/zond-wallet-provider/utils";
import browser from "webextension-polyfill";
import { UNRESTRICTED_METHODS } from "../constants/requestConstants";
import { EXTENSION_MESSAGES } from "../constants/streamConstants";
import {
  checkUrlOriginHasBeenConnected,
  checkWalletSwitchZondChainParams,
} from "../utils/unrestrictedMethodsMiddlewareUtils";

// a precheck to determine if the request can proceed
const checkRequestCanProceed = async (req: JsonRpcRequest<JsonRpcRequest>) => {
  const originConnectResult = await checkUrlOriginHasBeenConnected(
    req?.senderData?.url ?? "",
  );
  if (!originConnectResult.canProceed) {
    return originConnectResult;
  }
  switch (req.method) {
    case UNRESTRICTED_METHODS.WALLET_SWITCH_ZOND_CHAIN:
      // @ts-ignore
      return await checkWalletSwitchZondChainParams(req?.params?.[0]);
    default:
      return {
        canProceed: true,
        proceedError: providerErrors.unsupportedMethod(),
      };
  }
};

const getUnrestrictedMethodResult = async (
  req: JsonRpcRequest<JsonRpcRequest>,
) => {
  const tabId = req?.senderData?.tabId ?? 0;
  return await browser.tabs.sendMessage(tabId, {
    name: EXTENSION_MESSAGES.UNRESTRICTED_METHOD_CALLS,
    data: req,
  });
};

type UnrestrictedMethodValue =
  (typeof UNRESTRICTED_METHODS)[keyof typeof UNRESTRICTED_METHODS];

export const unrestrictedMethodsMiddleware: JsonRpcMiddleware<
  JsonRpcRequest,
  Json
> = async (req, res, next, end) => {
  const requestedMethod = req.method;
  if (
    Object.values(UNRESTRICTED_METHODS).includes(
      requestedMethod as UnrestrictedMethodValue,
    )
  ) {
    // check if the request can proceed
    const { canProceed, proceedError } = await checkRequestCanProceed(req);
    if (!canProceed) {
      // @ts-ignore
      res.error = proceedError;
      return end();
    }

    try {
      res.result = await getUnrestrictedMethodResult(req);
    } catch (error: any) {
      res.error = providerErrors.unsupportedMethod({
        message: error?.message,
      });
    }
    return end();
  } else {
    next();
  }
};
