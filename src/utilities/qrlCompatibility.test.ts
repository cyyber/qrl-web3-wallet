// @vitest-environment node

import { describe, expect, it } from "vitest";
import { MLDSA87, newMLDSA87Descriptor } from "@theqrl/wallet.js";
import {
  Common,
  FeeMarketEIP1559Transaction,
  create,
  decrypt,
  encrypt,
  hashMessage,
  recoverTransaction,
  seedToAccount,
  signTransaction,
} from "@theqrl/web3-qrl-accounts";
import { encodeFunctionCall, encodeParameters } from "@theqrl/web3-qrl-abi";
import { bytesToHex, hexToBytes } from "@theqrl/web3-utils";
import compatibility from "@/__fixtures__/qrlCompatibility.json";
import typedDataFixture from "@/__fixtures__/qrlTypedData.json";
import { getHexSeedFromMnemonic } from "@/functions/getHexSeedFromMnemonic";
import { getMnemonicFromHexSeed } from "@/functions/getMnemonicFromHexSeed";
import AddressUtil from "./addressUtil";
import {
  hashQrlTypedData,
  signQrlTypedData,
  type QrlTypedData,
} from "./qrlTypedData";

const seed = `0x${compatibility.wallets[0].extendedSeed}`;
const recipient = compatibility.wallets[1].address;
const typedDataVectors = typedDataFixture.vectors as unknown as {
  typedData: QrlTypedData;
  hash: string;
}[];

describe("current QRL node compatibility", () => {
  it.each(compatibility.wallets)(
    "derives the go-qrllib address for $name",
    (vector) => {
      const account = seedToAccount(`0x${vector.extendedSeed}`);
      expect(account.address.toLowerCase()).toBe(vector.address.toLowerCase());
      expect(account.address).toHaveLength(129);
      expect(AddressUtil.isQrlAddress(account.address)).toBe(true);
    },
  );

  it("creates and restores a 64-byte account through the wallet's mnemonic helpers", () => {
    const account = create();
    const mnemonic = getMnemonicFromHexSeed(account.seed);
    const restoredSeed = getHexSeedFromMnemonic(mnemonic);
    expect(restoredSeed).toBe(account.seed);
    expect(seedToAccount(restoredSeed).address).toBe(account.address);
    expect(account.address).toHaveLength(129);
  });

  it("round-trips an encrypted account with the updated cryptography", async () => {
    // Small KDF settings keep this integration test fast; production uses defaults.
    const keystore = await encrypt(seed, "compatibility-test", {
      m: 19456,
      t: 2,
      p: 1,
    });
    const account = await decrypt(keystore, "compatibility-test");
    expect(account.seed).toBe(seed);
    expect(account.address.toLowerCase()).toBe(
      compatibility.wallets[0].address.toLowerCase(),
    );
    await expect(decrypt(keystore, "wrong-password")).rejects.toThrow();
  });

  it.each(compatibility.abi)(
    "matches go-qrl's Hyperion ABI vector: $name",
    (vector) => {
      expect(
        encodeParameters(
          vector.inputs.map((input) => ({ name: "", ...input })),
          vector.values,
        ),
      ).toBe(vector.encoded);
    },
  );

  it("encodes a token transfer with a four-byte selector and 64-byte arguments", () => {
    const encoded = encodeFunctionCall(
      {
        type: "function",
        name: "transfer",
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
        ],
      },
      [recipient, "1"],
    );
    expect(encoded).toBe(
      `0xa9059cbb${recipient.slice(1)}${"1".padStart(128, "0")}`,
    );
  });

  it("signs and serializes transactions with the current authentication fields", async () => {
    const common = Common.custom({ chainId: 1337 });
    const unsigned = FeeMarketEIP1559Transaction.fromTxData(
      {
        chainId: 1337,
        nonce: 0,
        gasLimit: 21000,
        maxFeePerGas: 2000000000,
        maxPriorityFeePerGas: 1000000000,
        to: recipient,
        value: 1,
      },
      { common },
    );
    const signed = await signTransaction(unsigned, seed);
    const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
      hexToBytes(signed.rawTransaction),
      { common },
    );
    expect(signed.rawTransaction.startsWith("0x02")).toBe(true);
    expect(tx.raw()).toHaveLength(13);
    expect(tx.descriptor).toEqual(newMLDSA87Descriptor().toBytes());
    expect(tx.raw()[10]).toHaveLength(0);
    expect(tx.signature).toHaveLength(4627);
    expect(tx.publicKey).toHaveLength(2592);
    expect(tx.verifySignature()).toBe(true);
    expect(recoverTransaction(signed.rawTransaction).toLowerCase()).toBe(
      compatibility.wallets[0].address.toLowerCase(),
    );
    expect(bytesToHex(tx.hash())).toBe(signed.transactionHash);

    const changed = FeeMarketEIP1559Transaction.fromTxData(
      { ...tx.toJSON(), value: "0x02" },
      { common },
    );
    expect(changed.verifySignature()).toBe(false);
  });

  it.each(typedDataVectors)(
    "matches go-qrl's typed-data hash for $typedData.primaryType",
    (vector) => {
      expect(hashQrlTypedData(vector.typedData)).toBe(vector.hash);
    },
  );

  it("signs the typed-data digest without adding a personal-sign prefix", () => {
    const { typedData, hash } = typedDataVectors[0];
    const signed = signQrlTypedData(typedData, seed);
    const signature = hexToBytes(signed.signature);
    const publicKey = hexToBytes(signed.publicKey);
    const descriptor = newMLDSA87Descriptor();
    expect(
      MLDSA87.verify(signature, hexToBytes(hash), publicKey, descriptor),
    ).toBe(true);
    expect(
      MLDSA87.verify(
        signature,
        hexToBytes(hashMessage(hash)),
        publicKey,
        descriptor,
      ),
    ).toBe(false);
  });

  it("rejects missing, extra, and Ethereum-domain fields before signing", () => {
    const data = typedDataVectors[0].typedData;
    expect(() => hashQrlTypedData({ ...data, message: {} })).toThrow(
      "missing data for 'from'",
    );
    expect(() =>
      hashQrlTypedData({ ...data, message: { ...data.message, hidden: true } }),
    ).toThrow("extra data provided in 'Mail'");
    const { QRLTypedDataDomain, ...otherTypes } = data.types;
    const ethereumTypes = { ...otherTypes, EIP712Domain: QRLTypedDataDomain };
    expect(() =>
      hashQrlTypedData({
        ...data,
        types: ethereumTypes,
      } as unknown as QrlTypedData),
    ).toThrow('"types.QRLTypedDataDomain" is missing');
  });

  it.each([
    { type: "uint8", value: "256" },
    { type: "int8", value: "-129" },
    { type: "uint512", value: "-1" },
    { type: "uint256", value: Number.MAX_SAFE_INTEGER + 1 },
    { type: "uint08", value: "1" },
    { type: "address", value: `Q${"11".repeat(20)}` },
    { type: "bytes64", value: "0x01" },
    { type: "bool", value: "false" },
  ])(
    "rejects invalid $type values without truncation or coercion",
    ({ type, value }) => {
      const data = typedDataVectors[0].typedData;
      expect(() =>
        hashQrlTypedData({
          ...data,
          types: { ...data.types, Value: [{ name: "value", type }] },
          primaryType: "Value",
          message: { value },
        }),
      ).toThrow();
    },
  );
});
