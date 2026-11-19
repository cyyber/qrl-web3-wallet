import { ExtendedSeed, MLDSA87 } from "@theqrl/wallet.js";
import { getEncodedQRLTypedData } from "@theqrl/web3-qrl-abi";
import { parseAndValidateSeed } from "@theqrl/web3-qrl-accounts";
import type { QRLTypedData } from "@theqrl/web3-types";
import { bytesToHex, hexToBytes } from "@theqrl/web3-utils";

export type QrlTypedData = QRLTypedData;

// The digest go-qrl's apitypes.TypedDataAndHash produces: QRLTypedDataDomain,
// 64-byte ABI words and integers up to 512 bits. Web3 rejects a payload it
// cannot encode exactly (missing or extra fields, an Ethereum EIP712Domain,
// out-of-range values) instead of hashing a best-effort reading of it.
export function hashQrlTypedData(data: QrlTypedData): string {
  return getEncodedQRLTypedData(data, true);
}

export function signQrlTypedData(data: QrlTypedData, seed: string) {
  const digest = hashQrlTypedData(data);
  const seedBytes = parseAndValidateSeed(seed);
  let wallet: MLDSA87 | undefined;
  try {
    wallet = MLDSA87.newWalletFromExtendedSeed(new ExtendedSeed(seedBytes));
    // Typed data signs the digest directly, without a personal_sign prefix.
    return {
      signature: bytesToHex(wallet.sign(hexToBytes(digest))),
      publicKey: bytesToHex(wallet.getPK()),
    };
  } finally {
    wallet?.zeroize();
    seedBytes.fill(0);
  }
}
