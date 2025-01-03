import { BigNumber } from "@0x/utils";
import _ from "lodash";
import { BigNumber as EthersBigNumber, utils } from "packages/ethers";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const tokenAmountInUnitsToBigNumber = (
  amount: BigNumber,
  decimals: number
): BigNumber => {
  const decimalsPerToken = new BigNumber(10).pow(decimals);
  return amount.div(decimalsPerToken);
};

export function getImageUrl(tokenAddress?: string): string | undefined {
  if (!tokenAddress) return undefined;
  tokenAddress = utils.getAddress(tokenAddress);
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
}

export const EthersBigNumberTo0xBigNumber = (
  value: EthersBigNumber
): BigNumber => {
  return new BigNumber(value.toHexString());
};

export const xBigNumberToEthersBigNumber = (
  value: BigNumber
): EthersBigNumber => {
  return EthersBigNumber.from(value.toString());
};

export const toCamelCaseObj = (obj: any) => {
  const result: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      result[_.camelCase(key)] = obj[key];
    } else if (typeof obj[key] !== "object" || Array.isArray(obj[key])) {
      result[_.camelCase(key)] = obj[key];
    } else {
      result[_.camelCase(key)] = toCamelCaseObj(obj[key]);
    }
  });
  return result;
};
