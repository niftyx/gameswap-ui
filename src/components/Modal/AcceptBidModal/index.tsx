import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useTrade } from "contexts";
import React, { useState } from "react";
import { EAcceptBidStep } from "utils/enums";
import { xBigNumberToEthersBigNumber } from "utils/token";

import {
  AcceptApprovalStep,
  AcceptBidStep,
  AcceptGetInfoStep,
  BidSuccessStep,
  ShowPriceStep,
} from "../BiddingCommon";
import { TradeBasicModal } from "../TradeCommon";

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  step: EAcceptBidStep;
}

export const AcceptBidModal = (props: IProps) => {
  const {
    data: { asset, bid },
  } = useTrade();
  const { networkId } = useConnectedWeb3Context();

  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: EAcceptBidStep.ShowPrice,
  });

  if (!asset || !bid) return null;

  const price = {
    token: getTokenFromAddress(
      networkId || DEFAULT_NETWORK_ID,
      bid.erc20Address
    ),
    amount: xBigNumberToEthersBigNumber(bid.makerAssetAmount),
  };

  const renderContent = () => {
    switch (state.step) {
      case EAcceptBidStep.ShowPrice:
        return (
          <ShowPriceStep
            asset={asset}
            onCancel={() => {
              onClose();
            }}
            onConfirm={() => {
              // go to next step and get approval for the token and amount selected
              setState((prevState) => ({
                ...prevState,
                step: EAcceptBidStep.GetApprovalInfo,
              }));
            }}
            price={price}
          />
        );
      case EAcceptBidStep.GetApprovalInfo:
        return (
          <AcceptGetInfoStep
            onConfirm={(isUnlocked: boolean) => {
              if (!isUnlocked) {
                setState((prevState) => ({
                  ...prevState,
                  step: EAcceptBidStep.SetApproval,
                }));
              } else {
                setState((prevState) => ({
                  ...prevState,
                  step: EAcceptBidStep.AcceptBid,
                }));
              }
            }}
            tokenAddress={bid.erc721Address}
            tokenAmount={xBigNumberToEthersBigNumber(bid.takerAssetAmount)}
          />
        );
      case EAcceptBidStep.SetApproval:
        return (
          <AcceptApprovalStep
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: EAcceptBidStep.AcceptBid,
              }));
            }}
            tokenAddress={bid.erc721Address}
            tokenAmount={xBigNumberToEthersBigNumber(bid.takerAssetAmount)}
          />
        );
      case EAcceptBidStep.AcceptBid:
        return (
          <AcceptBidStep
            bid={bid}
            onConfirm={async () => {
              setState((prevState) => ({
                ...prevState,
                step: EAcceptBidStep.Success,
              }));
            }}
          />
        );
      case EAcceptBidStep.Success:
        return (
          <BidSuccessStep
            onClose={() => {
              onClose();
              window.location.reload();
            }}
            title={"You accepted a bid successfully"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TradeBasicModal onClose={onClose} title="Accept Bid" visible={visible}>
      {renderContent()}
    </TradeBasicModal>
  );
};
