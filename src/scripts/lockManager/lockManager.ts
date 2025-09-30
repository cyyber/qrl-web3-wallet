import StorageUtil from "@/utilities/storageUtil";
import { Bytes } from "@theqrl/web3";
import { decrypt, encrypt } from "./tempWeb3js";
import { getMnemonicFromHexSeed } from "@/functions/getMnemonicFromHexSeed";

type MessageType = {
  name: string;
  data: any;
};

export type EncryptAccountType = {
  seed: Bytes;
  password: string;
};

type DecryptedKeyType = {
  password: string;
  address: string;
  mnemonicPhrases: string;
};

export const LOCK_MANAGER_MESSAGES = {
  PORT: "LOCK_MANGER_PORT",
  IS_LOCK_MANAGER_READY: "IS_LOCK_MANAGER_READY",
  IS_LOCKED: "LOCK_MANAGER_IS_LOCKED",
  ENCRYPT_ACCOUNT: "ENCRYPT_ACCOUNT",
  LOCK: "LOCK_MANAGER_LOCK",
  UNLOCK: "LOCK_MANAGER_UNLOCK",
  LOCK_MANAGER_KEEP_LIVE: "LOCK_MANAGER_KEEP_LIVE",
  MNEMONIC_PHRASES: "MNEMONIC_PHRASES",
} as const;

/**
 * The lock manager, which is part of the extension service worker handles lock related data and functions.
 */
class LockManager {
  private static decryptedKeys?: DecryptedKeyType[];

  static lock() {
    this.clearDecryptedKeys();
  }

  static async unlock(password: string) {
    try {
      const keyStores = await StorageUtil.getKeystores();
      if (!keyStores.length) return;
      const decryptedKeys: DecryptedKeyType[] = [];
      keyStores.forEach((keyStore) => {
        // TODO: Replace with web3.js decrypt
        const { address, seed } = decrypt(keyStore, password);
        decryptedKeys.push({
          password,
          address,
          mnemonicPhrases: getMnemonicFromHexSeed(seed),
        });
      });
      this.setDecryptedKeys(
        Array.from(
          new Map(
            decryptedKeys.map((item) => [item.address.toLowerCase(), item]),
          ).values(),
        ),
      );
    } catch (err: any) {
      this.clearDecryptedKeys();
    }
  }

  static async isLocked() {
    let hasPasswordSet = true;
    const keyStores = await StorageUtil.getKeystores();
    if (!keyStores.length) {
      // If the keystore is missing in the storage, either the password was not set
      // or the storage was manually deleted.
      await StorageUtil.clearAllData();
      this.clearDecryptedKeys();
      hasPasswordSet = false;
    }
    return {
      isLocked: !!(this.decryptedKeys === undefined),
      hasPasswordSet,
    };
  }

  static async encryptAccount(accountData: EncryptAccountType) {
    const { password, seed } = accountData;
    const keystores = await StorageUtil.getKeystores();
    // TODO: Replace with web3.js encrypt
    const encryptedKeyStore = encrypt(seed, password);
    const updatedKeyStores = [...keystores, encryptedKeyStore];
    await StorageUtil.setKeystores(
      Array.from(
        new Map(
          updatedKeyStores.map((item) => [item.address.toLowerCase(), item]),
        ).values(),
      ),
    );
  }

  private static setDecryptedKeys(decryptedKeys: DecryptedKeyType[]) {
    this.decryptedKeys = decryptedKeys;
  }

  static getDecryptedKeys() {
    if (!this.decryptedKeys) {
      this.lock();
      throw new Error("Zond Web3 Wallet is locked");
    }
    return this.decryptedKeys;
  }

  private static clearDecryptedKeys() {
    this.decryptedKeys = undefined;
  }

  static async lockManagerListener(message: MessageType) {
    if (message.name === LOCK_MANAGER_MESSAGES.IS_LOCKED) {
      return await LockManager.isLocked();
    } else if (message.name === LOCK_MANAGER_MESSAGES.UNLOCK) {
      return await LockManager.unlock(message?.data?.password);
    } else if (message.name === LOCK_MANAGER_MESSAGES.LOCK) {
      return LockManager.lock();
    } else if (message.name === LOCK_MANAGER_MESSAGES.MNEMONIC_PHRASES) {
      return LockManager.getDecryptedKeys();
    } else if (message.name === LOCK_MANAGER_MESSAGES.ENCRYPT_ACCOUNT) {
      return await LockManager.encryptAccount(message?.data ?? {});
    }
  }
}

export default LockManager;
