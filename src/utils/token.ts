import { BigNumber } from "@0x/utils";
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
