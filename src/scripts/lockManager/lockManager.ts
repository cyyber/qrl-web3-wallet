import StorageUtil from "@/utilities/storageUtil";

type MessageType = {
  name: string;
  data: any;
};

export const LOCK_MANAGER_MESSAGES = {
  PORT: "LOCK_MANGER_PORT",
  IS_LOCK_MANAGER_READY: "IS_LOCK_MANAGER_READY",
  IS_LOCKED: "LOCK_MANAGER_IS_LOCKED",
  LOCK: "LOCK_MANAGER_LOCK",
  UNLOCK: "LOCK_MANAGER_UNLOCK",
  LOCK_MANAGER_KEEP_LIVE: "LOCK_MANAGER_KEEP_LIVE",
} as const;

/**
 * The lock manager, which is part of the extension service worker handles lock related data and functions.
 */
class LockManager {
  private static decryptedSeed?: string;

  static lock() {
    this.clearDecryptedSeed();
  }

  static async unlock(password: string) {
    try {
      const keyStores = await StorageUtil.getKeystores();
      if (!keyStores.length) return;
      if (password !== "1") {
        throw new Error("Invalid password");
      }
      // Use the web3.js decrypt function here once available
      const seed =
        "0x54e2c50efc39510986b61ccbfeaf68112de19a534af400d82d828e2f6de2ca2e9e530fa8909c3bcc76df137e117f2dde";
      this.setDecryptedSeed(seed);
    } catch (err: any) {
      this.clearDecryptedSeed();
    }
  }

  static async isLocked() {
    let hasPasswordSet = true;
    const keyStores = await StorageUtil.getKeystores();
    if (!keyStores.length) {
      // If the keystore is missing in the storage, either the password was not set
      // or the storage was manually deleted.
      await StorageUtil.clearAllData();
      this.clearDecryptedSeed();
      hasPasswordSet = false;
    }
    return { isLocked: !!(this.decryptedSeed === undefined), hasPasswordSet };
  }

  private static setDecryptedSeed(seed: string) {
    this.decryptedSeed = seed;
  }

  static getDecryptedSeed(): string {
    if (!this.decryptedSeed) throw new Error("Zond Web3 Wallet is locked");
    return this.decryptedSeed;
  }

  private static clearDecryptedSeed() {
    this.decryptedSeed = undefined;
  }

  static async lockManagerListener(message: MessageType) {
    if (message.name === LOCK_MANAGER_MESSAGES.IS_LOCKED) {
      return await LockManager.isLocked();
    } else if (message.name === LOCK_MANAGER_MESSAGES.UNLOCK) {
      return await LockManager.unlock(message?.data?.password);
    } else if (message.name === LOCK_MANAGER_MESSAGES.LOCK) {
      return LockManager.lock();
    }
  }

  //   (async () => {
  //     switch (message?.type) {
  //       case "VAULT_GET_ADDRESS": {
  //         // example: return the stored address from keystore
  //         const ks = await this.getKeyStore();
  //         sendResponse({ address: ks?.address ?? null });
  //         return;
  //       }
  //       case "VAULT_PERFORM_SIGN": {
  //         // example operation that uses decrypted seed
  //         try {
  //           if (this.isLocked()) {
  //             sendResponse({ success: false, error: "locked" });
  //             return;
  //           }
  //           const seed = this.getDecryptedSeed();
  //           // perform signing with seed (placeholder)
  //           const { payload } = message;
  //           // const signature = signWithSeed(seed, payload);
  //           const signature = "signed:" + JSON.stringify(payload); // stub
  //           sendResponse({ success: true, signature });
  //           return;
  //         } catch (e: any) {
  //           sendResponse({ success: false, error: e?.message ?? "error" });
  //           return;
  //         }
  //       }
  //       default:
  //         // not handled here
  //         return;
  //     }
  //   })
}

export default LockManager;
