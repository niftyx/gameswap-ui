/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { DEFAULT_PRICE, DEFAULT_USD, PRICE_DECIMALS } from "config/constants";
import { knownTokens } from "config/networks";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import { useFeaturedCollections, useFeaturedGames, useUserInfo } from "helpers";
import { useIsMountedRef } from "hooks";
import { parseEther } from "packages/ethers/utils";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getLogger } from "utils/logger";
import {
  IGlobalData,
  IGlobalPriceData,
  IUserInfo,
  KnownToken,
} from "utils/types.d";

const logger = getLogger("GlobalContext::");

const defaultTokenPrices: { [key in KnownToken]: IGlobalPriceData } = {
  gswap: {
    usd: DEFAULT_USD,
    price: DEFAULT_PRICE,
    decimals: PRICE_DECIMALS,
  },
  shroom: {
    usd: DEFAULT_USD,
    price: DEFAULT_PRICE,
    decimals: PRICE_DECIMALS,
  },
  wavax: {
    usd: DEFAULT_USD,
    price: DEFAULT_PRICE,
    decimals: PRICE_DECIMALS,
  },
};

const defaultData: IGlobalData = {
  itemCartIds: [],
  inventoryCartIds: [],
  price: defaultTokenPrices,
  collections: [],
  games: [],
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
  loadGames: (_?: string) => {},
  loadCollections: (_?: string) => {},
  updateUserInfo: (_?: IUserInfo) => {},
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

interface IGlobalStateData {
  itemCartIds: string[];
  inventoryCartIds: string[];
  price: { [key in KnownToken]: IGlobalPriceData };
  userInfo?: IUserInfo;
}

export const GlobalProvider = ({ children }: IProps) => {
  const [currentData, setCurrentData] = useState<IGlobalStateData>({
    itemCartIds: [],
    inventoryCartIds: [],
    price: defaultTokenPrices,
  });
  const { account, networkId } = useConnectedWeb3Context();
  const history = useHistory();
  const nextPath = new URLSearchParams(history.location.search).get("next");
  const {
    games: featuredGames,
    reload: reloadFeaturedGames,
  } = useFeaturedGames();
  const {
    collections: featuredCollections,
    reload: reloadFeaturedCollections,
  } = useFeaturedCollections();
  const { userInfo } = useUserInfo(account || "");

  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    const checkNextPath = (userInfo?: IUserInfo) => {
      if (nextPath) {
        const lNextPath = nextPath.toLowerCase();
        const customUrl =
          userInfo && userInfo.customUrl ? userInfo.customUrl : "";
        if (lNextPath.includes("/users/next/")) {
          const replacePath = customUrl
            ? lNextPath.replace("/users/next", `/${customUrl}`)
            : lNextPath.replace("/next/", `/${account}/`);
          history.push(replacePath);
        }
      }
    };
    if (!account) {
      updateUserInfo();
      checkNextPath();
    } else if (
      userInfo &&
      userInfo.id === account.toLowerCase() &&
      !currentData.userInfo
    ) {
      updateUserInfo(userInfo);
      checkNextPath(userInfo);
    }
  }, [account, userInfo]);

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
      if (isMountedRef.current === true) {
        setCurrentData((prevCurrentData) => ({
          ...prevCurrentData,
          price: tokenPrices,
        }));
      }
    } catch (error) {
      if (isMountedRef.current === true) {
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
    }, 30000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateData = (update = {}) => {
    const mergedData = Object.assign({}, currentData, update);
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

  const updateUserInfo = (userInfo?: IUserInfo) => {
    setCurrentData((prevData) => ({ ...prevData, userInfo }));
  };

  return (
    <GlobalContext.Provider
      value={{
        data: {
          ...currentData,
          games: featuredGames,
          collections: featuredCollections,
        },
        updateData: handleUpdateData,
        toggleInventoryCart,
        toggleItemCart,
        isInInventoryCart,
        isInItemCart,
        clearInventoryCart,
        clearItemCart,
        loadCollections: reloadFeaturedCollections,
        loadGames: reloadFeaturedGames,
        updateUserInfo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
