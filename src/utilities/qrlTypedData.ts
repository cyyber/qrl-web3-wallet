import {
  bytesToHex,
  hexToBytes,
  keccak256,
  utf8ToHex,
} from "@theqrl/web3-utils";
import { ExtendedSeed, MLDSA87 } from "@theqrl/wallet.js";
import { parseAndValidateSeed } from "@theqrl/web3-qrl-accounts";

type Field = { name: string; type: string };

export type QrlTypedData = {
  types: Record<string, Field[]>;
  primaryType: string;
  domain: Record<string, unknown>;
  message: Record<string, unknown>;
};

const DOMAIN_TYPE = "QRLTypedDataDomain";

// Web3 1.0.3 only exports an EIP712Domain encoder. QRL uses its own domain
// type name and 64-byte ABI words, as defined by go-qrl's apitypes package.
export function hashQrlTypedData(data: QrlTypedData): string {
  const fieldsFor = (type: string): Field[] => {
    if (!Object.prototype.hasOwnProperty.call(data.types, type)) {
      throw new Error(`Undefined typed-data type: ${type}`);
    }
    const fields = data.types[type];
    if (!Array.isArray(fields))
      throw new Error(`Invalid typed-data type: ${type}`);
    return fields;
  };

  const typeHash = (type: string): string => {
    const dependencies = new Set<string>();
    const visit = (name: string) => {
      if (dependencies.has(name)) return;
      dependencies.add(name);
      for (const field of fieldsFor(name)) {
        const baseType = field.type.replace(/\[\]$/, "");
        if (Object.prototype.hasOwnProperty.call(data.types, baseType))
          visit(baseType);
      }
    };
    visit(type);
    dependencies.delete(type);
    const encoded = [type, ...Array.from(dependencies).sort()]
      .map(
        (name) =>
          `${name}(${fieldsFor(name)
            .map((field) => `${field.type} ${field.name}`)
            .join(",")})`,
      )
      .join("");
    return keccak256(utf8ToHex(encoded));
  };

  const hashWord = (hash: string): string => hash.slice(2).padEnd(128, "0");

  const encodeValue = (type: string, value: unknown, depth: number): string => {
    if (depth > 64) throw new Error("Typed data is nested too deeply");
    if (type.endsWith("[]")) {
      if (!Array.isArray(value))
        throw new Error(`Expected an array for ${type}`);
      const encoded = value
        .map((item) => encodeValue(type.slice(0, -2), item, depth + 1))
        .join("");
      return hashWord(keccak256(`0x${encoded}`));
    }
    if (Object.prototype.hasOwnProperty.call(data.types, type)) {
      return hashWord(hashStruct(type, value, depth + 1));
    }
    if (type === "string" || type === "bytes") {
      if (typeof value !== "string")
        throw new Error(`Expected a string for ${type}`);
      if (type === "bytes" && !/^0x(?:[0-9a-fA-F]{2})*$/.test(value)) {
        throw new Error("Expected hex-encoded bytes");
      }
      return hashWord(keccak256(type === "string" ? utf8ToHex(value) : value));
    }
    if (type === "address") {
      if (typeof value !== "string" || !/^Q[0-9a-fA-F]{128}$/.test(value)) {
        throw new Error("Expected a 64-byte QRL address");
      }
      return value.slice(1).toLowerCase();
    }
    if (type === "bool") {
      if (typeof value !== "boolean") throw new Error("Expected a boolean");
      return (value ? "1" : "0").padStart(128, "0");
    }
    const bytes = /^bytes([1-9]|[1-5][0-9]|6[0-4])$/.exec(type);
    if (bytes) {
      if (
        typeof value !== "string" ||
        !/^0x[0-9a-fA-F]*$/.test(value) ||
        value.length !== 2 + Number(bytes[1]) * 2
      ) {
        throw new Error(`Expected exactly ${bytes[1]} bytes`);
      }
      return value.slice(2).toLowerCase().padEnd(128, "0");
    }
    // The published ABI coder limits integers to 256 bits; QRL typed data
    // supports up to 512 bits and sign-extends negative values to a full word.
    const integer = /^(u?int)([1-9][0-9]*)?$/.exec(type);
    if (integer) {
      const bits = Number(integer[2] || 512);
      if (bits < 8 || bits > 512 || bits % 8 !== 0)
        throw new Error(`Invalid integer type: ${type}`);
      if (
        !["string", "number", "bigint"].includes(typeof value) ||
        (typeof value === "number" && !Number.isSafeInteger(value))
      ) {
        throw new Error(`Expected an exact integer for ${type}`);
      }
      if (
        typeof value === "string" &&
        !/^-?(?:[0-9]+|0x[0-9a-fA-F]+)$/.test(value)
      ) {
        throw new Error(`Invalid integer for ${type}`);
      }
      const number = BigInt(value as string | number | bigint);
      const signed = integer[1] === "int";
      const bound = 1n << BigInt(signed ? bits - 1 : bits);
      if (number < (signed ? -bound : 0n) || number >= bound)
        throw new Error(`Integer out of range for ${type}`);
      return BigInt.asUintN(512, number).toString(16).padStart(128, "0");
    }
    throw new Error(`Unsupported typed-data primitive: ${type}`);
  };

  const hashStruct = (type: string, value: unknown, depth: number): string => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Expected an object for ${type}`);
    }
    const fields = fieldsFor(type);
    const record = value as Record<string, unknown>;
    if (
      Object.keys(record).some(
        (key) => !fields.some((field) => field.name === key),
      )
    ) {
      throw new Error(`Unexpected field in ${type}`);
    }
    const words = fields.map((field) => {
      if (
        !Object.prototype.hasOwnProperty.call(record, field.name) ||
        record[field.name] == null
      ) {
        throw new Error(`Missing typed-data field: ${field.name}`);
      }
      return encodeValue(field.type, record[field.name], depth);
    });
    return keccak256(`0x${hashWord(typeHash(type))}${words.join("")}`);
  };

  fieldsFor(DOMAIN_TYPE);
  const domainHash = hashStruct(DOMAIN_TYPE, data.domain, 0);
  const messageHash = hashStruct(data.primaryType, data.message, 0);
  return keccak256(`0x1901${domainHash.slice(2)}${messageHash.slice(2)}`);
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
