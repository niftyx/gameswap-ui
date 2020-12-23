import { TradeBuyModal, TradeSellModal } from "components";
import { getToken } from "config/networks";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import { BigNumber } from "ethers";
import React, { createContext, useContext, useState } from "react";
import { ESellBuy } from "utils/enums";
import { getLogger } from "utils/logger";
import { IAssetItem, ITokenAmount, ITradeData } from "utils/types";

const logger = getLogger("TradeContext::");

const defaultData: ITradeData = {
  asset: null,
  mode: ESellBuy.Sell,
};

const TradeContext = createContext({
  data: defaultData,
  openSellModal: (_: IAssetItem) => {},
  openBuyModal: (_: IAssetItem) => {},
  updateAssetPrice: (_: ITokenAmount) => {},
});

export const useTrade = () => {
  const context = useContext(TradeContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const TradeProvider = ({ children }: IProps) => {
  const [currentData, setCurrentData] = useState<ITradeData>(defaultData);
  const { networkId } = useConnectedWeb3Context();

  const openSellModal = (asset: IAssetItem) => {
    logger.log("openSellModal");
    setCurrentData((prevData) => ({
      ...prevData,
      mode: ESellBuy.Sell,
      asset: {
        ...asset,
        price: {
          amount: BigNumber.from(0),
          token: getToken(networkId || 1, "weth"),
        },
      },
    }));
  };

  const openBuyModal = (asset: IAssetItem) => {
    logger.log("openBuyModal");
    setCurrentData((prevData) => ({
      ...prevData,
      mode: ESellBuy.Buy,
      asset,
    }));
  };

  const onCloseModal = () => {
    setCurrentData((prevData) => ({
      ...prevData,
      asset: null,
    }));
  };

  const updateAssetPrice = (price: ITokenAmount) => {
    if (currentData.asset) {
      setCurrentData((prevData) => ({
        ...prevData,
        asset: prevData.asset ? { ...prevData.asset, price } : null,
      }));
    }
  };

  const isTradeSellModalOpened =
    currentData.asset && currentData.mode === ESellBuy.Sell;
  const isTradeBuyModalOpened =
    currentData.asset && currentData.mode === ESellBuy.Buy;

  return (
    <TradeContext.Provider
      value={{
        data: currentData,
        openSellModal,
        openBuyModal,
        updateAssetPrice,
      }}
    >
      {children}
      {isTradeSellModalOpened && (
        <TradeSellModal
          onClose={onCloseModal}
          visible={isTradeSellModalOpened}
        />
      )}
      {isTradeBuyModalOpened && (
        <TradeBuyModal onClose={onCloseModal} visible={isTradeBuyModalOpened} />
      )}
    </TradeContext.Provider>
  );
};

export const TradeConsumer = TradeContext.Consumer;

export default TradeContext;
