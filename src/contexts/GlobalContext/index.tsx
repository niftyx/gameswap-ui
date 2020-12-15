/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { DEFAULT_PRICE, DEFAULT_USD, PRICE_DECIMALS } from "config/constants";
import { getToken } from "config/networks";
import { BigNumber, ethers } from "ethers";
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getLogger } from "utils/logger";
import { IGlobalData } from "utils/types.d";

const logger = getLogger("GlobalContext::");

const defaultData: IGlobalData = {
  itemCartIds: [],
  inventoryCartIds: [],
  price: {
    eth: {
      usd: DEFAULT_USD,
      price: DEFAULT_PRICE,
    },
    gswap: {
      usd: DEFAULT_USD,
      price: DEFAULT_PRICE,
    },
  },
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

const fetchGSwapPrice = async (): Promise<{
  usd: number;
  price: BigNumber;
}> => {
  try {
    const token = getToken(1, "gswap");
    const response = (
      await axios.get(
        `https://api.coingecko.com/api/v3/coins/ethereum/contract/${token.address}`
      )
    ).data;

    const usdPrice = response["market_data"]["current_price"]["usd"];

    return {
      usd: Number(usdPrice),
      price: ethers.utils.parseUnits(String(usdPrice), PRICE_DECIMALS),
    };
  } catch (error) {
    logger.error("fetchGSwapPrice::", error);
    return { usd: DEFAULT_USD, price: DEFAULT_PRICE };
  }
};

const fetchEthPrice = async (): Promise<{ usd: number; price: BigNumber }> => {
  try {
    const response = (
      await axios.get("https://api.coingecko.com/api/v3/coins/ethereum")
    ).data;

    const usdPrice = response["market_data"]["current_price"]["usd"];
    return {
      usd: Number(usdPrice),
      price: ethers.utils.parseUnits(String(usdPrice), PRICE_DECIMALS),
    };
  } catch (error) {
    logger.error("fetchEthPrice::", error);
    return { usd: DEFAULT_USD, price: DEFAULT_PRICE };
  }
};

interface IProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: IProps) => {
  const [currentData, setCurrentData] = useState(defaultData);

  const fetchPrices = async (): Promise<void> => {
    try {
      const [ethResult, gswapResult] = await Promise.all([
        fetchEthPrice(),
        fetchGSwapPrice(),
      ]);
      setCurrentData((prevCurrentData) => ({
        ...prevCurrentData,
        price: {
          eth: ethResult,
          gswap: gswapResult,
        },
      }));
    } catch (error) {
      setCurrentData((prevCurrentData) => ({
        ...prevCurrentData,
        price: {
          eth: {
            usd: DEFAULT_USD,
            price: DEFAULT_PRICE,
          },
          gswap: {
            usd: DEFAULT_USD,
            price: DEFAULT_PRICE,
          },
        },
      }));
    }
  };

  useEffect(() => {
    fetchPrices();
    return () => {};
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
