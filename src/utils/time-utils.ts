import { BigNumber } from "@0x/utils";

export const DEFAULT_ORDER_EXPIRY_SECONDS = new BigNumber(31536000);

export const todayInSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

export const getExpirationTimeOrdersFromConfig = () => {
  return new BigNumber(todayInSeconds()).plus(DEFAULT_ORDER_EXPIRY_SECONDS);
};
