import { SignedOrder } from "@0x/types";
import { makeStyles } from "@material-ui/core";
import { useTrade } from "contexts";
import React, { useState } from "react";
import { ETradeStep } from "utils/enums";
import { getLogger } from "utils/logger";

import {
  TradeBasicModal,
  TradeBuyAssetStep,
  TradePriceInputStep,
  TradeSellApprovalStep,
  TradeSellAssetStep,
  TradeSellGetInfoStep,
  TradeSuccessStep,
} from "../TradeCommon";
import { TradeSelectOrderStep } from "../TradeCommon/TradeSelectOrderStep";

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
            onConfirm={(order: SignedOrder) => {
              setState((prevState) => ({
                ...prevState,
                step: ETradeStep.BuyAsset,
                selectedOrder: order,
              }));
            }}
          />
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
