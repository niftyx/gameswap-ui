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
  erc721Confirmed: boolean;
  erc20Confirmed: boolean;
}

export const AcceptBidModal = (props: IProps) => {
  const {
    data: { asset, bid },
  } = useTrade();
  const { networkId } = useConnectedWeb3Context();

  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: EAcceptBidStep.ShowPrice,
    erc20Confirmed: false,
    erc721Confirmed: false,
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
            collectionAmount={xBigNumberToEthersBigNumber(bid.takerAssetAmount)}
            collectionId={bid.erc721Address}
            onConfirm={(erc721Confirmed: boolean, erc20Confirmed: boolean) => {
              if (!erc721Confirmed || !erc20Confirmed) {
                setState((prevState) => ({
                  ...prevState,
                  step: EAcceptBidStep.SetApproval,
                  erc20Confirmed,
                  erc721Confirmed,
                }));
              } else {
                setState((prevState) => ({
                  ...prevState,
                  step: EAcceptBidStep.AcceptBid,
                }));
              }
            }}
            tokenAddress={bid.erc20Address}
            tokenAmount={xBigNumberToEthersBigNumber(bid.takerFee)}
          />
        );
      case EAcceptBidStep.SetApproval:
        return (
          <AcceptApprovalStep
            collectionAmount={xBigNumberToEthersBigNumber(bid.takerAssetAmount)}
            collectionId={bid.erc721Address}
            erc20Confirmed={state.erc20Confirmed}
            erc721Confirmed={state.erc721Confirmed}
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: EAcceptBidStep.AcceptBid,
              }));
            }}
            tokenAddress={bid.erc20Address}
            tokenAmount={xBigNumberToEthersBigNumber(bid.takerFee)}
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
