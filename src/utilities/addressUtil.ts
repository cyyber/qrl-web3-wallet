import {
  QRL_ADDRESS_HEX_LENGTH,
  QRL_ADDRESS_LENGTH,
  QRL_ADDRESS_PREFIX,
} from "@/constants/address";

const QRL_ADDRESS_REGEX = new RegExp(
  `^${QRL_ADDRESS_PREFIX}[0-9a-fA-F]{${QRL_ADDRESS_HEX_LENGTH}}$`,
);

class AddressUtil {
  static isQrlAddress(address: string): boolean {
    return QRL_ADDRESS_REGEX.test(address);
  }

  static isLegacyQrlAddress(address: string): boolean {
    return /^Q[0-9a-fA-F]{40}$/.test(address);
  }

  static normalizeQrlAddress(address: string): string {
    const trimmed = address.trim();
    if (!AddressUtil.isQrlAddress(trimmed)) {
      throw new Error(`Expected ${QRL_ADDRESS_LENGTH}-character QRL address`);
    }
    return trimmed;
  }

  static shortenQrlAddress(address: string, headLength = 10, tailLength = 8): string {
    if (address.length <= headLength + tailLength) {
      return address;
    }
    return `${address.slice(0, headLength)}...${address.slice(-tailLength)}`;
  }
}

export default AddressUtil;
