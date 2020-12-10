import axios from "axios";
import { ETH_PRICE_DECIMALS } from "config/constants";
import { getToken, networkIds } from "config/networks";
import { ConnectedWeb3Context } from "contexts/connectedWeb3";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

const defaultEthPrice = BigNumber.from(0.3 * Math.pow(10, ETH_PRICE_DECIMALS));

export const useEthPrice = (
  context: ConnectedWeb3Context
): {
  price: BigNumber;
  usd: number;
  fetchPrice: () => Promise<void>;
} => {
  const { account, library: provider, networkId } = context;
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const [usd, setUsd] = useState<number>(0);

  const fetchPrice = async () => {
    try {
      if (account && networkId) {
        if (networkId === networkIds.MAINNET) {
          const token = getToken(networkId, "gswap");
          const response = (
            await axios.get("https://api.coingecko.com/api/v3/coins/ethereum")
          ).data;

          const usdPrice = response["market_data"]["current_price"]["usd"];
          setUsd(Number(usdPrice));
          setPrice(BigNumber.from(usdPrice * Math.pow(10, ETH_PRICE_DECIMALS)));
        } else {
          setUsd(0);
          setPrice(BigNumber.from(defaultEthPrice));
        }
      }
    } catch (error) {
      console.warn("-useGSwapPrice-", error);
      setPrice(BigNumber.from(0));
      setUsd(0);
    }
  };
  useEffect(() => {
    fetchPrice();

    // eslint-disable-next-line
  }, [provider, account, networkId]);

  return { price, usd, fetchPrice };
};
