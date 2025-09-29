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
  MNEMONIC_PHRASES: "MNEMONIC_PHRASES",
} as const;

/**
 * The lock manager, which is part of the extension service worker handles lock related data and functions.
 */
class LockManager {
  private static decryptedMnemonicPhrases?: string;

  static lock() {
    this.clearDecryptedMnemonicPhrases();
  }

  static async unlock(password: string) {
    try {
      const keyStores = await StorageUtil.getKeystores();
      if (!keyStores.length) return;
      if (password !== "1") {
        throw new Error("Invalid password");
      }
      // Use the web3.js decrypt function here once available
      const mnemonicPhrases =
        "fondly closet award series fish obey retail smell yet wary banana tailor only cuba virtue attic coca china convex taiwan skinny trendy floor wind motor serum small ideal bear tendon lime tact";
      this.setDecryptedMnemonicPhrases(mnemonicPhrases);
    } catch (err: any) {
      this.clearDecryptedMnemonicPhrases();
    }
  }

  static async isLocked() {
    let hasPasswordSet = true;
    const keyStores = await StorageUtil.getKeystores();
    if (!keyStores.length) {
      // If the keystore is missing in the storage, either the password was not set
      // or the storage was manually deleted.
      await StorageUtil.clearAllData();
      this.clearDecryptedMnemonicPhrases();
      hasPasswordSet = false;
    }
    return {
      isLocked: !!(this.decryptedMnemonicPhrases === undefined),
      hasPasswordSet,
    };
  }

  private static setDecryptedMnemonicPhrases(seed: string) {
    this.decryptedMnemonicPhrases = seed;
  }

  static getDecryptedMnemonicPhrases(): string {
    if (!this.decryptedMnemonicPhrases)
      throw new Error("Zond Web3 Wallet is locked");
    return this.decryptedMnemonicPhrases;
  }

  private static clearDecryptedMnemonicPhrases() {
    this.decryptedMnemonicPhrases = undefined;
  }

  static async lockManagerListener(message: MessageType) {
    if (message.name === LOCK_MANAGER_MESSAGES.IS_LOCKED) {
      return await LockManager.isLocked();
    } else if (message.name === LOCK_MANAGER_MESSAGES.UNLOCK) {
      return await LockManager.unlock(message?.data?.password);
    } else if (message.name === LOCK_MANAGER_MESSAGES.LOCK) {
      return LockManager.lock();
    } else if (message.name === LOCK_MANAGER_MESSAGES.MNEMONIC_PHRASES) {
      return LockManager.getDecryptedMnemonicPhrases();
    }
  }
}

export default LockManager;
