import { BigNumber as xBigNumber } from "@0x/utils";
import { BigNumber, ethers } from "packages/ethers";

export const ZERO_NUMBER = BigNumber.from(0);
export const ONE_NUMBER = BigNumber.from(1);
export const MAX_NUMBER = ethers.constants.MaxUint256;

export const round = (num: xBigNumber): xBigNumber =>
  num.integerValue(xBigNumber.ROUND_FLOOR);
