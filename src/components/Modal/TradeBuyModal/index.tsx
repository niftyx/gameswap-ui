import { SignedOrder } from "@0x/types";
import { useTrade } from "contexts";
import React, { useState } from "react";
import { ETradeStep } from "utils/enums";

import {
  TradeBasicModal,
  TradeBuyApprovalStep,
  TradeBuyAssetStep,
  TradeBuyGetInfoStep,
  TradeCancelOrderStep,
  TradeSuccessStep,
} from "../TradeCommon";
import { TradeSelectOrderStep } from "../TradeCommon/TradeSelectOrderStep";

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  step: ETradeStep;
  selectedOrder: SignedOrder | null;
  orderToCancel?: SignedOrder;
}

export const TradeBuyModal = (props: IProps) => {
  const {
    data: { asset },
  } = useTrade();
  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: ETradeStep.SelectOrder,
    selectedOrder: null,
  });

  if (!asset) return null;

  const { prices } = asset;

  if (!prices) return null;

  const renderContent = () => {
    switch (state.step) {
      case ETradeStep.SelectOrder:
        return (
          <TradeSelectOrderStep
            asset={asset}
            onCancel={(order: SignedOrder) => {
              setState((prevState) => ({
                ...prevState,
                orderToCancel: order,
                step: ETradeStep.CancelOrder,
              }));
            }}
            onConfirm={(order: SignedOrder) => {
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.BuyGetApproveInfo,
                selectedOrder: order,
              }));
            }}
          />
        );
      case ETradeStep.CancelOrder:
        return (
          state.orderToCancel && (
            <TradeCancelOrderStep
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
      case ETradeStep.BuyGetApproveInfo:
        return (
          state.selectedOrder && (
            <TradeBuyGetInfoStep
              onConfirm={(approved) => {
                if (!approved) {
                  setState((prevState) => ({
                    ...prevState,
                    step: ETradeStep.BuySetApproval,
                  }));
                } else {
                  setState((prevState) => ({
                    ...prevState,
                    step: ETradeStep.BuyAsset,
                  }));
                }
              }}
              order={state.selectedOrder}
            />
          )
        );
      case ETradeStep.BuySetApproval:
        return (
          state.selectedOrder && (
            <TradeBuyApprovalStep
              onConfirm={() => {
                setState((prevState) => ({
                  ...prevState,
                  step: ETradeStep.BuyAsset,
                }));
              }}
              order={state.selectedOrder}
            />
          )
        );
      case ETradeStep.BuyAsset:
        return (
          state.selectedOrder && (
            <TradeBuyAssetStep
              asset={asset}
              onConfirm={() => {
                setState((prevState) => ({
                  ...prevState,
                  step: ETradeStep.Success,
                }));
                window.location.reload();
              }}
              order={state.selectedOrder}
            />
          )
        );
      case ETradeStep.Success:
        return (
          <TradeSuccessStep
            title={
              state.orderToCancel
                ? "Order is cancelled successfully!"
                : "Order is filled successfully!"
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <TradeBasicModal onClose={onClose} title="Trade Process" visible={visible}>
      {renderContent()}
    </TradeBasicModal>
  );
};
