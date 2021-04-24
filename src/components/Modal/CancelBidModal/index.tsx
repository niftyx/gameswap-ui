import { useTrade } from "contexts";
import React, { useState } from "react";
import { ECancelBidStep } from "utils/enums";

import {
  BidSuccessStep,
  CancelBidStep,
  CancelOrderConfirmStep,
} from "../BiddingCommon";
import { TradeBasicModal } from "../TradeCommon";

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  step: ECancelBidStep;
}

export const CancelBidModal = (props: IProps) => {
  const {
    data: { bid },
  } = useTrade();
  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: ECancelBidStep.Confirm,
  });

  if (!bid) return null;

  const renderContent = () => {
    switch (state.step) {
      case ECancelBidStep.Confirm:
        return (
          <CancelOrderConfirmStep
            onCancel={onClose}
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: ECancelBidStep.CancelBid,
              }));
            }}
          />
        );
      case ECancelBidStep.CancelBid:
        return (
          <CancelBidStep
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: ECancelBidStep.Success,
              }));
            }}
            order={bid}
          />
        );

      case ECancelBidStep.Success:
        return (
          <BidSuccessStep
            onClose={() => {
              onClose();
              window.location.reload();
            }}
            title={"Bid cancelled successfully"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TradeBasicModal onClose={onClose} title="Cancel Bid" visible={visible}>
      {renderContent()}
    </TradeBasicModal>
  );
};
