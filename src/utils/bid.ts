import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { formatBigNumber } from "utils";

import { xBigNumberToEthersBigNumber } from "./token";
import { IGlobalPriceData, ISignedOrder, KnownToken } from "./types";

export const getHighestBid = (
  bids: ISignedOrder[],
  price: { [key in KnownToken]: IGlobalPriceData },
  networkId: number
): ISignedOrder | null => {
  if (bids.length === 0) return null;

  const data = bids.map((bid) => {
    const token = getTokenFromAddress(bid.erc20Address, networkId);
    const calcPrice = xBigNumberToEthersBigNumber(bid.makerAssetAmount).mul(
      (price as any)[token.symbol.toLowerCase()].price
    );
    return {
      bid,
      calcPrice,
    };
  });
  data.sort((d1, d2) => {
    if (d1.calcPrice.lt(d2.calcPrice)) {
      return 1;
    }
    if (d1.calcPrice.lt(d2.calcPrice)) {
      return -1;
    }
    return 0;
  });
  return data[0].bid;
};

export const getLowestAsk = (
  asks: ISignedOrder[],
  price: { [key in KnownToken]: IGlobalPriceData },
  chainId?: number
): ISignedOrder | null => {
  const networkId = chainId || DEFAULT_NETWORK_ID;
  if (asks.length === 0) return null;
  const data = asks.map((asks) => {
    const token = getTokenFromAddress(asks.erc20Address, networkId);
    const calcPrice = xBigNumberToEthersBigNumber(asks.takerAssetAmount).mul(
      (price as any)[token.symbol.toLowerCase()].price
    );
    return {
      asks,
      calcPrice,
    };
  });
  data.sort((d1, d2) => {
    if (d1.calcPrice.lt(d2.calcPrice)) {
      return -1;
    }
    if (d1.calcPrice.lt(d2.calcPrice)) {
      return 1;
    }
    return 0;
  });
  return data[0].asks;
};
