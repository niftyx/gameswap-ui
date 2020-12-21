import { SignedOrder } from "@0x/types";
import { makeStyles } from "@material-ui/core";
import { useTrade } from "contexts";
import React, { useState } from "react";
import { ETradeStep } from "utils/enums";
import { getLogger } from "utils/logger";

import {
  TradeBasicModal,
  TradePriceInputStep,
  TradeSellApprovalStep,
  TradeSellAssetStep,
  TradeSellGetInfoStep,
  TradeSuccessStep,
} from "../TradeCommon";

const logger = getLogger("TradeSellModal::");

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  step: ETradeStep;
  selectedOrder: SignedOrder | null;
}

export const TradeBuyModal = (props: IProps) => {
  const classes = useStyles();
  const {
    data: { asset },
    updateAssetPrice,
  } = useTrade();
  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: ETradeStep.SelectOrder,
    selectedOrder: null,
  });

  if (!asset) return null;

  const { price } = asset;

  if (!price) return null;

  const renderContent = () => {
    switch (state.step) {
      case ETradeStep.SelectOrder:
        return (
          <TradePriceInputStep
            asset={asset}
            onConfirm={() => {
              // go to next step and get approval for the token and amount selected
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.GetSellApproveInfo,
              }));
            }}
            updatePrice={updateAssetPrice}
          />
        );
      case ETradeStep.GetSellApproveInfo:
        return (
          <TradeSellGetInfoStep
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
        return <TradeSuccessStep title="Order is created successfully!" />;
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
