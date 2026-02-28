import { createContext, useContext } from "react";
import AccountLabelsStore from "./accountLabelsStore";
import ContactsStore from "./contactsStore";
import DAppRequestStore from "./dAppRequestStore";
import LedgerStore from "./ledgerStore";
import LockStore from "./lockStore";
import PriceStore from "./priceStore";
import SettingsStore from "./settingsStore";
import TransactionHistoryStore from "./transactionHistoryStore";
import ZondStore from "./zondStore";

class Store {
  lockStore;
  settingsStore;
  dAppRequestStore;
  zondStore;
  ledgerStore;
  transactionHistoryStore;
  contactsStore;
  accountLabelsStore;
  priceStore;

  constructor() {
    this.lockStore = new LockStore();
    this.settingsStore = new SettingsStore();
    this.dAppRequestStore = new DAppRequestStore();
    this.zondStore = new ZondStore();
    this.ledgerStore = new LedgerStore();
    this.transactionHistoryStore = new TransactionHistoryStore();
    this.contactsStore = new ContactsStore();
    this.accountLabelsStore = new AccountLabelsStore();
    this.priceStore = new PriceStore();
    this.priceStore.initialize(this.settingsStore.showBalanceAndPrice);
  }
}

export type StoreType = InstanceType<typeof Store>;
export const store = new Store();
const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;
