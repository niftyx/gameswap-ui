/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import {
  DEFAULT_PRICE,
  DEFAULT_USD,
  GSWAP_COLLECTION,
  PRICE_DECIMALS,
} from "config/constants";
import { getToken, knownTokens } from "config/networks";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useIsMountedRef } from "hooks";
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getLogger } from "utils/logger";
import { IGlobalData, KnownToken } from "utils/types.d";

const logger = getLogger("GlobalContext::");

const defaultTokenPrices = {
  gswap: {
    usd: DEFAULT_USD,
    price: DEFAULT_PRICE,
    decimals: PRICE_DECIMALS,
  },
  weth: {
    usd: DEFAULT_USD,
    price: DEFAULT_PRICE,
    decimals: PRICE_DECIMALS,
  },
  shroom: {
    usd: DEFAULT_USD,
    price: DEFAULT_PRICE,
    decimals: PRICE_DECIMALS,
  },
};

const defaultData: IGlobalData = {
  itemCartIds: [],
  inventoryCartIds: [],
  price: defaultTokenPrices,
  collections: [GSWAP_COLLECTION],
};

const GlobalContext = createContext({
  data: defaultData,
  updateData: () => {},
  toggleItemCart: (_: string) => {},
  toggleInventoryCart: (_: string) => {},
  isInItemCart: (_: string) => {},
  isInInventoryCart: (_: string) => {},
  clearItemCart: () => {},
  clearInventoryCart: () => {},
});

/**
 * This hook can only be used by components under the `GlobalProvider` component. Otherwise it will throw.
 */
export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: IProps) => {
  const [currentData, setCurrentData] = useState<IGlobalData>(defaultData);

  const isRefMounted = useIsMountedRef();

  const fetchPrices = async (): Promise<void> => {
    try {
      const tokenIds = Object.values(knownTokens).map(
        (e) => e.coingeckoTokenId
      );
      const prices = (
        await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
            Object.values(tokenIds).join(",")
          )}&vs_currencies=usd`
        )
      ).data;

      const tokenPrices = { ...defaultTokenPrices };

      Object.keys(prices).map((coingeckoId) => {
        Object.keys(knownTokens).map((tokenId) => {
          if (
            knownTokens[tokenId as KnownToken].coingeckoTokenId === coingeckoId
          ) {
            tokenPrices[tokenId as KnownToken] = {
              decimals: knownTokens[tokenId as KnownToken].decimals,
              usd: prices[coingeckoId].usd,
              price: parseEther(String(prices[coingeckoId].usd)),
            };
          }
        });
      });
      if (isRefMounted.current === true) {
        setCurrentData((prevCurrentData) => ({
          ...prevCurrentData,
          price: tokenPrices,
        }));
      }
    } catch (error) {
      if (isRefMounted.current === true) {
        setCurrentData((prevCurrentData) => ({
          ...prevCurrentData,
          price: defaultTokenPrices,
        }));
      }
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(() => {
      fetchPrices();
    }, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleUpdateData = (update = {}) => {
    const mergedData = _.merge({}, currentData, update);
    setCurrentData(mergedData);
  };

  const toggleItemCart = (cartId: string) => {
    if (currentData.itemCartIds.includes(cartId)) {
      setCurrentData((prevData) => ({
        ...prevData,
        itemCartIds: prevData.itemCartIds.filter(
          (element) => element !== cartId
        ),
      }));
    } else {
      setCurrentData((prevData) => ({
        ...prevData,
        itemCartIds: [...prevData.itemCartIds, cartId],
      }));
    }
  };

  const toggleInventoryCart = (cartId: string) => {
    if (currentData.inventoryCartIds.includes(cartId)) {
      setCurrentData((prevData) => ({
        ...prevData,
        inventoryCartIds: prevData.inventoryCartIds.filter(
          (element) => element !== cartId
        ),
      }));
    } else {
      setCurrentData((prevData) => ({
        ...prevData,
        inventoryCartIds: [...prevData.inventoryCartIds, cartId],
      }));
    }
  };

  const isInItemCart = (cartId: string): boolean => {
    return currentData.itemCartIds.includes(cartId);
  };

  const isInInventoryCart = (cartId: string): boolean => {
    return currentData.inventoryCartIds.includes(cartId);
  };

  const clearItemCart = () => {
    setCurrentData((prevData) => ({
      ...prevData,
      itemCartIds: [],
    }));
  };

  const clearInventoryCart = () => {
    setCurrentData((prevData) => ({
      ...prevData,
      inventoryCartIds: [],
    }));
  };

  const closeWalletConnectModal = () => {
    setCurrentData((prev) => ({
      ...prev,
      walletConnectModalOpened: false,
    }));
  };

  return (
    <GlobalContext.Provider
      value={{
        data: currentData,
        updateData: handleUpdateData,
        toggleInventoryCart,
        toggleItemCart,
        isInInventoryCart,
        isInItemCart,
        clearInventoryCart,
        clearItemCart,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
