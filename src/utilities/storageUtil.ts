import {
  BlockchainDataType,
  DEFAULT_BLOCKCHAIN,
  ZOND_BLOCKCHAINS,
} from "@/configuration/zondBlockchainConfig";
import {
  ConnectedAccountsDataType,
  DAppRequestType,
} from "@/scripts/middlewares/middlewareTypes";
import browser from "webextension-polyfill";

const ACCOUNTS_IDENTIFIER = "ACCOUNTS";
const ALL_ACCOUNTS_IDENTIFIER = "ALL_ACCOUNTS";
const ACTIVE_ACCOUNT_IDENTIFIER = "ACTIVE_ACCOUNT";

const DAPPS_IDENTIFIER = "DAPPS";
const DAPPS_REQUEST_DATA_IDENTIFIER = "DAPPS_REQUEST_DATA";
const DAPPS_CONNECTED_ACCOUNTS_IDENTIFIER = "DAPPS_CONNECTED_ACCOUNTS";

const BLOCKCHAINS_IDENTIFIER = "BLOCKCHAINS";
const ALL_BLOCKCHAINS_IDENTIFIER = "ALL_BLOCKCHAINS";
const ACTIVE_BLOCKCHAIN_IDENTIFIER = "ACTIVE_BLOCKCHAIN";

const ACTIVE_PAGE_IDENTIFIER = "ACTIVE_PAGE";

const TRANSACTION_VALUES_IDENTIFIER = "TRANSACTION_VALUES";

const TOKENS_LIST_IDENTIFIER = "TOKENS_LIST";

type TransactionValuesType = {
  receiverAddress?: string;
  amount?: number;
  mnemonicPhrases?: string;
  tokenDetails?: {
    isZrc20Token: boolean;
    tokenContractAddress: string;
    tokenDecimals: number;
    tokenIcon: string;
    tokenBalance: string;
    tokenName: string;
    tokenSymbol: string;
  };
};

/**
 * A utility for storing and retrieving states of different components to and from the browser storage.
 */
class StorageUtil {
  /**
   * A function for storing the transaction state values, so that the user need not fill in the field values if the extension is closed and opened again.
   * Call the getTransactionValues fuction to retieve the stored value.
   */
  static async setTransactionValues(transactionValues: TransactionValuesType) {
    const { chainId } = await this.getBlockChain();
    const transactionValuesIdentifier = `${chainId}_${TRANSACTION_VALUES_IDENTIFIER}`;
    const transactionValuesWithDefaultValues = {
      receiverAddress: transactionValues.receiverAddress ?? "",
      amount: transactionValues.amount ?? 0,
      tokenDetails: transactionValues.tokenDetails,
    };
    await browser.storage.local.set({
      [transactionValuesIdentifier]: transactionValuesWithDefaultValues,
    });
  }

  static async getTransactionValues() {
    const { chainId } = await this.getBlockChain();
    const transactionValuesIdentifier = `${chainId}_${TRANSACTION_VALUES_IDENTIFIER}`;
    let transactionValues: TransactionValuesType = {
      receiverAddress: "",
      amount: 0,
      mnemonicPhrases: "",
    };

    const storedTransactionValues = await browser.storage.local.get(
      transactionValuesIdentifier,
    );
    if (storedTransactionValues) {
      transactionValues = {
        ...transactionValues,
        ...storedTransactionValues[transactionValuesIdentifier],
      };
    }

    return transactionValues;
  }

  static async clearTransactionValues() {
    const { chainId } = await this.getBlockChain();
    const transactionValuesIdentifier = `${chainId}_${TRANSACTION_VALUES_IDENTIFIER}`;
    await browser.storage.local.remove(transactionValuesIdentifier);
  }

  /**
   * A function for storing the accounts created and imported within the zond web3 wallet extension.
   * Call the getAccountList function to retrieve the stored value.
   */
  static async setAccountList(accountList: string[]) {
    const { chainId } = await this.getBlockChain();
    const blockChainAccountListIdentifier = `${chainId}_${ALL_ACCOUNTS_IDENTIFIER}`;
    await browser.storage.local.set({
      [blockChainAccountListIdentifier]: accountList,
    });
  }

  static async getAccountList() {
    const { chainId } = await this.getBlockChain();
    const blockChainAccountListIdentifier = `${chainId}_${ALL_ACCOUNTS_IDENTIFIER}`;
    const storedAccountList = await browser.storage.local.get(
      blockChainAccountListIdentifier,
    );

    return Object.keys(storedAccountList).length
      ? storedAccountList[blockChainAccountListIdentifier]
      : [];
  }

  /**
   * A function for storing the active account in the wallet.
   * Call the getActiveAccount function to retrieve the stored value, and clearActiveAccount for clearing the stored value.
   */
  static async setActiveAccount(activeAccount?: string) {
    const { chainId } = await this.getBlockChain();
    const blockChainAccountIdentifier = `${chainId}_${ACTIVE_ACCOUNT_IDENTIFIER}`;
    if (activeAccount) {
      await browser.storage.local.set({
        [blockChainAccountIdentifier]: activeAccount ?? "",
      });
    } else {
      await browser.storage.local.remove(blockChainAccountIdentifier);
    }
  }

  static async getActiveAccount() {
    const { chainId } = await this.getBlockChain();
    const blockChainAccountIdentifier = `${chainId}_${ACTIVE_ACCOUNT_IDENTIFIER}`;
    const storedActiveAccount = await browser.storage.local.get(
      blockChainAccountIdentifier,
    );
    return (storedActiveAccount?.[blockChainAccountIdentifier] ?? "") as string;
  }

  static async clearActiveAccount() {
    const { chainId } = await this.getBlockChain();
    const blockChainAccountIdentifier = `${chainId}_${ACTIVE_ACCOUNT_IDENTIFIER}`;
    await browser.storage.local.remove(blockChainAccountIdentifier);
  }

  /**
   * A function for storing all the available blockchains.
   * Call the getAllBlockChains function to retrieve all the stored blockchains.
   */
  static async setAllBlockChains(blockchains: BlockchainDataType[]) {
    const existing = (
      await browser.storage.local.get(BLOCKCHAINS_IDENTIFIER)
    )?.[BLOCKCHAINS_IDENTIFIER];
    await browser.storage.local.set({
      [BLOCKCHAINS_IDENTIFIER]: {
        ...existing,
        [ALL_BLOCKCHAINS_IDENTIFIER]: blockchains,
      },
    });
  }

  static async getAllBlockChains() {
    const storedBlockchains = await browser.storage.local.get(
      BLOCKCHAINS_IDENTIFIER,
    );
    return (storedBlockchains?.[BLOCKCHAINS_IDENTIFIER]?.[
      ALL_BLOCKCHAINS_IDENTIFIER
    ] ?? ZOND_BLOCKCHAINS) as BlockchainDataType[];
  }

  /**
   * A function for storing the blockchain selection.
   * Call the getBlockChain function to retrieve the stored value.
   */
  static async setBlockChain(selectedBlockchainId: string) {
    const existing = (
      await browser.storage.local.get(BLOCKCHAINS_IDENTIFIER)
    )?.[BLOCKCHAINS_IDENTIFIER];
    await browser.storage.local.set({
      [BLOCKCHAINS_IDENTIFIER]: {
        ...existing,
        [ACTIVE_BLOCKCHAIN_IDENTIFIER]: selectedBlockchainId,
      },
    });
  }

  static async getBlockChain() {
    const storedBlockchainId = await browser.storage.local.get(
      BLOCKCHAINS_IDENTIFIER,
    );
    const blockchains = await this.getAllBlockChains();
    const existingChain = blockchains.find(
      (chain) =>
        chain.chainId.toLowerCase() ===
        storedBlockchainId?.[BLOCKCHAINS_IDENTIFIER]?.[
          ACTIVE_BLOCKCHAIN_IDENTIFIER
        ]?.toLowerCase(),
    );
    return existingChain ?? DEFAULT_BLOCKCHAIN;
  }

  /**
   * A function for storing the route to be displayed on opening the extension.
   * Call the getActivePage function to retrieve the stored value, and clearActivePage for clearing the stored value.
   */
  static async setActivePage(activePage: string) {
    if (activePage) {
      await browser.storage.local.set({ [ACTIVE_PAGE_IDENTIFIER]: activePage });
    } else {
      await browser.storage.local.remove(ACTIVE_PAGE_IDENTIFIER);
    }
  }

  static async getActivePage() {
    const storedActivePage = await browser.storage.local.get(
      ACTIVE_PAGE_IDENTIFIER,
    );
    return (storedActivePage?.[ACTIVE_PAGE_IDENTIFIER] ?? "") as string;
  }

  static async clearActivePage() {
    await browser.storage.local.remove(ACTIVE_PAGE_IDENTIFIER);
  }

  /**
   * A function for storing the list of imported tokens.
   * Call the getTokenContractsList function to retrieve the stored value, and clearFromTokenList for clearing the stored value.
   */
  static async setTokenContractsList(
    accountAddress: string,
    contractAddress: string,
  ) {
    const { chainId } = await this.getBlockChain();
    const tokensListIdentifier = `${chainId}_${TOKENS_LIST_IDENTIFIER}_${accountAddress.toUpperCase()}`;
    let storedTokensList = await this.getTokenContractsList(accountAddress);
    storedTokensList.push(contractAddress);

    await browser.storage.local.set({
      [tokensListIdentifier]: Array.from(new Set(storedTokensList)),
    });
  }

  static async getTokenContractsList(accountAddress: string) {
    const { chainId } = await this.getBlockChain();
    const tokensListIdentifier = `${chainId}_${TOKENS_LIST_IDENTIFIER}_${accountAddress.toUpperCase()}`;
    const storedTokensList =
      await browser.storage.local.get(tokensListIdentifier);

    return (storedTokensList?.[tokensListIdentifier] ?? []) as string[];
  }

  static async clearFromTokenContractsList(
    accountAddress: string,
    contractAddress: string,
  ) {
    const { chainId } = await this.getBlockChain();
    const tokensListIdentifier = `${chainId}_${TOKENS_LIST_IDENTIFIER}_${accountAddress.toUpperCase()}`;
    let storedTokensList = await this.getTokenContractsList(accountAddress);

    await browser.storage.local.set({
      [tokensListIdentifier]: Array.from(
        new Set(
          storedTokensList.filter((address) => address !== contractAddress),
        ),
      ),
    });
  }

  /**
   * A function for storing the request info temporarily by the dApp, which will be read by the zond web3 wallet.
   * Call the getDAppRequestData function to retrieve the stored value, and clearFromTokenList for clearing the stored value.
   */
  static async setDAppRequestData(data: DAppRequestType) {
    const { chainId } = await this.getBlockChain();
    const dAppRequestDataIdentifier = `${chainId}_${DAPPS_REQUEST_DATA_IDENTIFIER}`;
    await browser.storage.session.set({
      [dAppRequestDataIdentifier]: data,
    });
  }

  static async getDAppRequestData() {
    const { chainId } = await this.getBlockChain();
    const dAppRequestDataIdentifier = `${chainId}_${DAPPS_REQUEST_DATA_IDENTIFIER}`;
    const storedDAppRequestData = await browser.storage.session.get(
      dAppRequestDataIdentifier,
    );
    return storedDAppRequestData[dAppRequestDataIdentifier] as
      | DAppRequestType
      | undefined;
  }

  static async clearDAppRequestData() {
    const { chainId } = await this.getBlockChain();
    const dAppRequestDataIdentifier = `${chainId}_${DAPPS_REQUEST_DATA_IDENTIFIER}`;
    await browser.storage.session.remove(dAppRequestDataIdentifier);
  }

  /**
   * A function for storing the connected accounts info temporarily, which will be read by method like 'zond_accounts'.
   * Call the getConnectedAccountsData function to retrieve the stored value, and clearConnectedAccountsData for clearing the stored value.
   */
  static async setConnectedAccountsData(data: ConnectedAccountsDataType) {
    const urlOrigin = data.urlOrigin;
    const { chainId } = await this.getBlockChain();
    const connectedAccountsDataIdentifier = `${chainId}_${urlOrigin}_${DAPPS_CONNECTED_ACCOUNTS_IDENTIFIER}`;
    const updatedConnectedAccountsData: ConnectedAccountsDataType = {
      urlOrigin,
      accounts: data.accounts,
    };
    await browser.storage.local.set({
      [connectedAccountsDataIdentifier]: updatedConnectedAccountsData,
    });
  }

  static async getConnectedAccountsData(urlOrigin: string = "") {
    const { chainId } = await this.getBlockChain();
    const connectedAccountsDataIdentifier = `${chainId}_${urlOrigin}_${DAPPS_CONNECTED_ACCOUNTS_IDENTIFIER}`;
    const storedConnectedAccountsData = await browser.storage.local.get(
      connectedAccountsDataIdentifier,
    );
    return storedConnectedAccountsData[connectedAccountsDataIdentifier] as
      | ConnectedAccountsDataType
      | undefined;
  }

  static async clearConnectedAccountsData(urlOrigin: string = "") {
    const { chainId } = await this.getBlockChain();
    const connectedAccountsDataIdentifier = `${chainId}_${urlOrigin}_${DAPPS_CONNECTED_ACCOUNTS_IDENTIFIER}`;
    await browser.storage.local.remove(connectedAccountsDataIdentifier);
  }
}

export default StorageUtil;
