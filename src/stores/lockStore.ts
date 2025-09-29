import { LOCK_MANAGER_MESSAGES } from "@/scripts/lockManager/lockManager";
import StorageUtil, { LockState } from "@/utilities/storageUtil";
import { action, makeAutoObservable } from "mobx";
import browser from "webextension-polyfill";

const MAX_LOCK_MANAGER_RETRY = 3;
const LOCK_MANAGER_RETRY_DELAY = 2000;

class LockStore {
  port?: browser.Runtime.Port = undefined;
  isServiceWorkerReady = false;
  hasPasswordSet = true;
  isLoading = true;
  isLocked = true;

  constructor() {
    makeAutoObservable(this, {
      setupPassword: action.bound,
      readLockState: action.bound,
      lock: action.bound,
      unlock: action.bound,
    });

    this.initializePort();
    this.initializeStorageListener();
  }

  keepServiceWorkerActive() {
    setInterval(() => {
      browser.runtime
        .connect({
          name: LOCK_MANAGER_MESSAGES.LOCK_MANAGER_KEEP_LIVE,
        })
        .postMessage(LOCK_MANAGER_MESSAGES.LOCK_MANAGER_KEEP_LIVE);
    }, 3000);
  }

  initializePort(retryCount = 0) {
    try {
      this.port?.disconnect();
      this.port = browser.runtime.connect({ name: LOCK_MANAGER_MESSAGES.PORT });
      this.port?.onDisconnect?.addListener(() => {
        const lastErr = browser.runtime.lastError;
        if (lastErr) {
          console.warn(
            "Lock Manager: Port disconnected with error:",
            lastErr.message,
          );
        } else {
          console.warn("Lock Manager: Port disconnected");
        }
        this.isServiceWorkerReady = false;
        if (retryCount < MAX_LOCK_MANAGER_RETRY) {
          setTimeout(() => {
            this.initializePort(retryCount + 1);
          }, LOCK_MANAGER_RETRY_DELAY);
        }
      });
      this.port?.onMessage?.addListener((message) => {
        if (message.name === LOCK_MANAGER_MESSAGES.IS_LOCK_MANAGER_READY) {
          this.isServiceWorkerReady = true;
          this.readLockState();
        }
      });
      this.keepServiceWorkerActive();
    } catch (error) {
      console.warn("Lock Manager: Error connecting to service worker:", error);
      this.isServiceWorkerReady = false;
      if (retryCount < MAX_LOCK_MANAGER_RETRY) {
        setTimeout(() => {
          this.initializePort(retryCount + 1);
        }, LOCK_MANAGER_RETRY_DELAY);
      }
    }
  }

  initializeStorageListener() {
    // If the locking system was triggered, we write timestamp to storage via `StorageUtil.updateLockStateTimeStamp`
    //  to make sure that the extensions on all tabs are reflecting the lock state.
    browser.storage.onChanged.addListener(async () => {
      await this.readLockState();
    });
  }

  async setupPassword(password: string) {
    // TODO: use the web3.js encrypt to generate the encryption data
    const keystores = await StorageUtil.getKeystores();
    const keystore = {
      id: "1",
      version: 3 as const,
      address: "",
      crypto: {
        cipher: "aes-128-ctr" as const,
        ciphertext: "",
        cipherparams: {
          iv: "",
        },
        kdf: "pbkdf2" as const,
        kdfparams: {
          dklen: 0,
          n: 0,
          p: 0,
          r: 0,
          salt: "",
        },
        mac: "",
      },
    };
    await StorageUtil.setKeystores([...keystores, keystore]);
  }

  async readLockState() {
    if (!this.isServiceWorkerReady) {
      this.initializePort();
      return;
    }
    try {
      const { isLocked, hasPasswordSet } = await browser.runtime.sendMessage({
        name: LOCK_MANAGER_MESSAGES.IS_LOCKED,
      });
      this.isLocked = isLocked;
      this.hasPasswordSet = hasPasswordSet;
      this.isLoading = false;
    } catch (error) {
      console.warn(error);
    }
  }

  async lock() {
    await browser.runtime.sendMessage({
      name: LOCK_MANAGER_MESSAGES.LOCK,
    });
    const { isLocked } = await browser.runtime.sendMessage({
      name: LOCK_MANAGER_MESSAGES.IS_LOCKED,
    });
    this.isLocked = isLocked;
    StorageUtil.updateLockStateTimeStamp(LockState.LOCKED);
  }

  // Unlocks the wallet and returns true if successful. Returns false otherwise.
  async unlock(password: string) {
    await browser.runtime.sendMessage({
      name: LOCK_MANAGER_MESSAGES.UNLOCK,
      data: { password },
    });
    const { isLocked } = await browser.runtime.sendMessage({
      name: LOCK_MANAGER_MESSAGES.IS_LOCKED,
    });
    this.isLocked = isLocked;
    StorageUtil.updateLockStateTimeStamp(LockState.UNLOCKED);
    return !isLocked;
  }
}

export default LockStore;
