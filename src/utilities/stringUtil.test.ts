import { describe, expect, it } from "vitest";
import { QRL_EXAMPLE_ADDRESS, QRL_EXAMPLE_ADDRESS_3 } from "@/constants/address";
import StringUtil from "./stringUtil";

describe("stringUtil", () => {
  it("should split the address with default split length of 5", () => {
    const accountAddress = QRL_EXAMPLE_ADDRESS;
    const expectedSplitAddress =
      "00000 00000 00000 00000 00000 00000 00000 00000 00000 00000 00000 08A8e AFb1c f62Bf Beb17 41769 DAE1a 9dd47 99619 2";
    const { prefix, addressSplit } = StringUtil.getSplitAddress(accountAddress);

    expect(prefix).toBe("Q");
    expect(addressSplit.join(" ")).toBe(expectedSplitAddress);
  });

  it("should split the address with the given length of 8", () => {
    const accountAddress = QRL_EXAMPLE_ADDRESS;
    const expectedSplitAddress =
      "00000000 00000000 00000000 00000000 00000000 00000000 00000000 8A8eAFb1 cf62BfBe b1741769 DAE1a9dd 47996192";
    const { prefix, addressSplit } = StringUtil.getSplitAddress(
      accountAddress,
      8,
    );

    expect(prefix).toBe("Q");
    expect(addressSplit.join(" ")).toBe(expectedSplitAddress);
  });

  it("should split the address to array of strings", () => {
    const address = QRL_EXAMPLE_ADDRESS_3;
    const expectedPrefix = "Q";
    const expectedAddressSplit = [
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "00000",
      "0201B",
      "dF510",
      "d5aa6",
      "6d1b5",
      "DB98d",
      "FB0f3",
      "0D40b",
      "6Ea47",
      "D",
    ];
    expect(StringUtil.getSplitAddress(address).prefix).toEqual(expectedPrefix);
    expect(StringUtil.getSplitAddress(address).addressSplit).toEqual(
      expectedAddressSplit,
    );
  });
});
