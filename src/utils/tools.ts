import { getTokenFromAddress } from "config/networks";
import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { formatBigNumber } from "utils";

import { xBigNumberToEthersBigNumber } from "./token";
import { IAssetItem, ISignedOrder, ITokenAmount, KnownToken } from "./types";

export const isAddress = (address: string): boolean => {
  try {
    getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
};

export const isContract = async (
  provider: any,
  address: string
): Promise<boolean> => {
  const code = await provider.getCode(address);
  return code && code !== "0x";
};

export const getObjectIdFromHex = (id: string) => {
  return `0x${id.substr(2).replace(/^0+/, "")}`;
};

interface IResponse {
  asset: IAssetItem | null;
  minUSDPrice: number;
  minPriceOrderIndex: number;
  minTokenAmountString: string;
}

export const getAssetObjectWithPrices = (
  asset: IAssetItem | null,
  orders: ISignedOrder[],
  price: {
    gswap: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
    weth: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
    shroom: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
  },
  networkId: number
): IResponse => {
  if (!asset)
    return {
      asset,
      minUSDPrice: 0,
      minPriceOrderIndex: 0,
      minTokenAmountString: "",
    };

  let minUSDPrice = 0;
  let minPriceOrderIndex = 0;
  let minTokenAmountString = "";

  const prices: ITokenAmount[] = orders.map((order, orderIndex) => {
    const token = getTokenFromAddress(networkId, order.erc20Address);
    const loadedUSDPrice = price[token.symbol.toLowerCase() as KnownToken];
    const USDPrice = xBigNumberToEthersBigNumber(order.takerAssetAmount).mul(
      loadedUSDPrice.price
    );

    const USDPriceNumber = Number(
      formatBigNumber(USDPrice, token.decimals + loadedUSDPrice.decimals)
    );

    if (minUSDPrice === 0 || minUSDPrice > USDPriceNumber) {
      minUSDPrice = USDPriceNumber;
      minPriceOrderIndex = orderIndex;
      minTokenAmountString = `${formatBigNumber(
        xBigNumberToEthersBigNumber(order.takerAssetAmount),
        token.decimals
      )} ${token.symbol}`;
    }
    return {
      amount: xBigNumberToEthersBigNumber(order.takerAssetAmount),
      token,
    };
  });

  return {
    asset: { ...asset, prices },
    minPriceOrderIndex,
    minUSDPrice,
    minTokenAmountString,
  };
};
