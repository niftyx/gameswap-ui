import { SignedOrder } from "@0x/types";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useTrade } from "contexts";
import React, { useState } from "react";
import { waitSeconds } from "utils";
import { NULL_ADDRESS } from "utils/address";
import { ETradeStep } from "utils/enums";
import { MAX_NUMBER } from "utils/number";

import {
  TradCancelOrderStep,
  TradeBasicModal,
  TradePriceInputStep,
  TradeSellApprovalStep,
  TradeSellAssetStep,
  TradeSellGetInfoStep,
  TradeSuccessStep,
} from "../TradeCommon";

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  step: ETradeStep;
  orderToCancel?: SignedOrder;
}

export const TradeSellModal = (props: IProps) => {
  const {
    data: { asset },
    updateAssetPrice,
  } = useTrade();
  const { networkId } = useConnectedWeb3Context();

  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: ETradeStep.InputPrice,
  });

  if (!asset) return null;

  const { price } = asset;

  if (!price) return null;

  const renderContent = () => {
    if (!asset.price) return null;

    switch (state.step) {
      case ETradeStep.InputPrice:
        return (
          <TradePriceInputStep
            asset={asset}
            onCancel={(order: SignedOrder) => {
              setState((prevState) => ({
                ...prevState,
                orderToCancel: order,
                step: ETradeStep.CancelOrder,
              }));
            }}
            onConfirm={() => {
              // go to next step and get approval for the token and amount selected
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.GetSellApproveInfo,
              }));
            }}
            onPutSale={async () => {
              updateAssetPrice({
                amount: MAX_NUMBER,
                token: getToken(networkId || DEFAULT_NETWORK_ID, "wavax"),
              });
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.GetSellApproveInfo,
              }));
            }}
            updatePrice={updateAssetPrice}
          />
        );
      case ETradeStep.CancelOrder:
        return (
          state.orderToCancel && (
            <TradCancelOrderStep
              onConfirm={() => {
                setState((prevState) => ({
                  ...prevState,
                  step: ETradeStep.Success,
                }));
                window.location.reload();
              }}
              order={state.orderToCancel}
            />
          )
        );
      case ETradeStep.GetSellApproveInfo:
        return (
          <TradeSellGetInfoStep
            collectionId={asset.collectionId}
            onConfirm={(isUnlocked: boolean) => {
              if (!isUnlocked) {
                setState((prevState) => ({
                  ...prevState,
                  step: ETradeStep.SetSellApproval,
                }));
              } else {
                setState((prevState) => ({
                  ...prevState,
                  step: ETradeStep.SellAsset,
                }));
              }
            }}
          />
        );
      case ETradeStep.SetSellApproval:
        return (
          <TradeSellApprovalStep
            collectionId={asset.collectionId}
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.SellAsset,
              }));
            }}
          />
        );
      case ETradeStep.SellAsset:
        return (
          <TradeSellAssetStep
            asset={asset}
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.Success,
              }));
              window.location.reload();
            }}
          />
        );
      case ETradeStep.Success:
        return (
          <TradeSuccessStep
            title={
              state.orderToCancel
                ? "Order is cancelled successfully!"
                : "Order is created successfully!"
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <TradeBasicModal onClose={onClose} title="Sell Asset" visible={visible}>
      {renderContent()}
    </TradeBasicModal>
  );
};
