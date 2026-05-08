import {
  QRL_ADDRESS_LENGTH,
  QRL_EXAMPLE_ADDRESS,
  QRL_EXAMPLE_ADDRESS_2,
} from "@/constants/address";
import { describe, expect, it } from "vitest";
import AddressUtil from "./addressUtil";

describe("addressUtil", () => {
  it("accepts 48-byte Q-prefixed QRL addresses", () => {
    expect(QRL_EXAMPLE_ADDRESS).toHaveLength(QRL_ADDRESS_LENGTH);
    expect(AddressUtil.isQrlAddress(QRL_EXAMPLE_ADDRESS)).toBe(true);
    expect(AddressUtil.isQrlAddress(QRL_EXAMPLE_ADDRESS_2)).toBe(true);
  });

  it("rejects legacy 20-byte QRL addresses as current addresses", () => {
    const legacyAddress = "Q20B714091cF2a62DADda2847803e3f1B9D2D3779";

    expect(AddressUtil.isQrlAddress(legacyAddress)).toBe(false);
    expect(AddressUtil.isLegacyQrlAddress(legacyAddress)).toBe(true);
  });

  it("normalizes only valid current QRL addresses", () => {
    expect(AddressUtil.normalizeQrlAddress(` ${QRL_EXAMPLE_ADDRESS} `)).toBe(
      QRL_EXAMPLE_ADDRESS,
    );
    expect(() => AddressUtil.normalizeQrlAddress("Q1234")).toThrow(
      "Expected 97-character QRL address",
    );
  });

  it("shortens long addresses for compact UI display", () => {
    expect(AddressUtil.shortenQrlAddress(QRL_EXAMPLE_ADDRESS)).toBe(
      "Q000000000...47996192",
    );
  });
});
