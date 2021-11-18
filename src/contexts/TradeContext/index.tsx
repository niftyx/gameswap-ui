import {
  AcceptBidModal,
  CancelBidModal,
  PlaceBidModal,
  TradeBuyModal,
  TradeSellModal,
} from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import { BigNumber } from "packages/ethers";
import React, { createContext, useContext, useState } from "react";
import { ETradeType } from "utils/enums";
import { getLogger } from "utils/logger";
import {
  IAssetItem,
  ISignedOrder,
  ITokenAmount,
  ITradeData,
} from "utils/types";

const logger = getLogger("TradeContext::");

const defaultData: ITradeData = {
  asset: null,
  mode: ETradeType.Sell,
};

const TradeContext = createContext({
  data: defaultData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openSellModal: (_: IAssetItem) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openBuyModal: (_: IAssetItem) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openPlaceBidModal: (_: IAssetItem) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openAcceptBidModal: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: IAssetItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bid: ISignedOrder
  ) => {},
  openCancelBidModal: (_: ISignedOrder) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      mode: ETradeType.Sell,
      asset: {
        ...asset,
        price: {
          amount: BigNumber.from(0),
          token: getToken("gswap", networkId),
        },
      },
    }));
  };

  const openBuyModal = (asset: IAssetItem) => {
    logger.log("openBuyModal");
    setCurrentData((prevData) => ({
      ...prevData,
      mode: ETradeType.Buy,
      asset,
    }));
  };

  const openPlaceBidModal = (asset: IAssetItem) => {
    logger.log("openPlaceBidModal");
    setCurrentData((prevData) => ({
      ...prevData,
      mode: ETradeType.PlaceBid,
      asset,
    }));
  };

  const openAcceptBidModal = (asset: IAssetItem, bid: ISignedOrder) => {
    logger.log("openPlaceBidModal");
    setCurrentData((prevData) => ({
      ...prevData,
      mode: ETradeType.AcceptBid,
      asset,
      bid,
    }));
  };

  const openCancelBidModal = (bid: ISignedOrder) => {
    logger.log("openCancelBidModal");
    setCurrentData((prevData) => ({
      ...prevData,
      mode: ETradeType.CancelBid,

      bid,
    }));
  };

  const onCloseModal = () => {
    setCurrentData((prevData) => ({
      ...prevData,
      asset: null,
      bid: null,
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
    currentData.asset && currentData.mode === ETradeType.Sell;
  const isTradeBuyModalOpened =
    currentData.asset && currentData.mode === ETradeType.Buy;
  const isPlaceBidModalOpened =
    !!currentData.asset && currentData.mode === ETradeType.PlaceBid;
  const isAcceptBidModalOpened =
    !!currentData.asset && currentData.mode === ETradeType.AcceptBid;
  const isCancelBidModalOpened =
    !!currentData.bid && currentData.mode === ETradeType.CancelBid;

  return (
    <TradeContext.Provider
      value={{
        data: currentData,
        openSellModal,
        openBuyModal,
        updateAssetPrice,
        openPlaceBidModal,
        openAcceptBidModal,
        openCancelBidModal,
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
      {isPlaceBidModalOpened && (
        <PlaceBidModal onClose={onCloseModal} visible={isPlaceBidModalOpened} />
      )}
      {isAcceptBidModalOpened && (
        <AcceptBidModal
          onClose={onCloseModal}
          visible={isAcceptBidModalOpened}
        />
      )}
      {isCancelBidModalOpened && (
        <CancelBidModal
          onClose={onCloseModal}
          visible={isCancelBidModalOpened}
        />
      )}
    </TradeContext.Provider>
  );
};

export const TradeConsumer = TradeContext.Consumer;

export default TradeContext;
