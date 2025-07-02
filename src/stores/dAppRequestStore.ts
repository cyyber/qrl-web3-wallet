import { EXTENSION_MESSAGES } from "@/scripts/constants/streamConstants";
import {
  DAppRequestType,
  DAppResponseType,
} from "@/scripts/middlewares/middlewareTypes";
import { getSerializableObject } from "@/scripts/utils/scriptUtils";
import StorageUtil from "@/utilities/storageUtil";
import { action, makeAutoObservable, observable } from "mobx";
import browser from "webextension-polyfill";

type CurrentTabData = {
  favIconUrl: string;
  urlOrigin: string;
  title: string;
};

class DAppRequestStore {
  hasDAppConnected = false;
  currentTabData?: CurrentTabData;
  dAppRequestData?: DAppRequestType;
  responseData: any = {};
  canProceed: boolean = false;
  onPermissionCallBack: (hasApproved: boolean) => Promise<void> = async () =>
    undefined;
  approvalProcessingStatus = {
    isProcessing: false,
    hasApproved: false,
    hasCompleted: false,
  };

  constructor() {
    makeAutoObservable(this, {
      dAppRequestData: observable.struct,
      responseData: observable.struct,
      readDAppRequestData: action.bound,
      addToResponseData: action.bound,
      setCanProceed: action.bound,
      setOnPermissionCallBack: action.bound,
      onPermission: action.bound,
      approvalProcessingStatus: observable.struct,
    });
    this.fetchCurrentTabUrl();
  }

  get hasDAppRequest() {
    return !!this.dAppRequestData;
  }

  async fetchCurrentTabUrl() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const currentTab = tabs[0];
    this.currentTabData = {
      favIconUrl: currentTab?.favIconUrl ?? "",
      title: currentTab?.title ?? "",
      urlOrigin: new URL(currentTab?.url ?? "").origin,
    };
    const connectedAccounts = await StorageUtil.getConnectedAccountsData(
      this.currentTabData.urlOrigin,
    );
    this.hasDAppConnected = !!connectedAccounts?.accounts?.length;
  }

  async readDAppRequestData() {
    const storedDAppRequestData = await StorageUtil.getDAppRequestData();
    this.dAppRequestData = storedDAppRequestData;
  }

  addToResponseData(data: any) {
    const serializableData = getSerializableObject(data);
    this.responseData = { ...this.responseData, ...serializableData };
  }

  setCanProceed(decision: boolean) {
    this.canProceed = decision;
  }

  setOnPermissionCallBack(callBack: (hasApproved: boolean) => Promise<void>) {
    this.onPermissionCallBack = callBack;
  }

  async setApprovalProcessingStatus(status: {
    isProcessing?: boolean;
    hasApproved?: boolean;
    hasCompleted?: boolean;
  }) {
    this.approvalProcessingStatus = {
      ...this.approvalProcessingStatus,
      ...status,
    };
  }

  async onPermission(hasApproved: boolean) {
    try {
      this.setApprovalProcessingStatus({
        isProcessing: true,
        hasApproved,
      });
      await this.onPermissionCallBack(hasApproved);
      const response: DAppResponseType = {
        method: this.dAppRequestData?.method ?? "",
        action: EXTENSION_MESSAGES.DAPP_RESPONSE,
        hasApproved,
        response: this.responseData,
      };
      await browser.runtime.sendMessage(response);
    } catch (error) {
      console.warn(
        "ZondWeb3Wallet: Error while resolving the permission request\n",
        error,
      );
    } finally {
      await StorageUtil.clearDAppRequestData();
      this.setApprovalProcessingStatus({
        isProcessing: false,
        hasCompleted: true,
      });
    }
  }
}

export default DAppRequestStore;
