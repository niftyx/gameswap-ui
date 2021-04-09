import { SignedOrder } from "@0x/types";
import { BigNumber } from "@ethersproject/bignumber";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useTrade } from "contexts";
import React, { useState } from "react";
import { EBidStep } from "utils/enums";
import { MAX_NUMBER, ZERO_NUMBER } from "utils/number";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { IToken } from "utils/types";

import {
  BidApprovalStep,
  BidGetInfoStep,
  BidInputStep,
  BidSuccessStep,
  PlaceBidStep,
} from "../BiddingCommon";
import { TradeBasicModal } from "../TradeCommon";

interface IProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

interface IState {
  step: EBidStep;
  price: {
    amount: BigNumber;
    token: IToken;
  };
}

export const PlaceBidModal = (props: IProps) => {
  const {
    data: { asset },
  } = useTrade();
  const { networkId } = useConnectedWeb3Context();

  const { onClose, onSuccess, visible } = props;
  const [state, setState] = useState<IState>({
    step: EBidStep.InputPrice,
    price: {
      amount: ZERO_NUMBER,
      token: getToken(networkId || DEFAULT_NETWORK_ID, "wavax"),
    },
  });

  const updatePrice = (price: { amount: BigNumber; token: IToken }) => {
    setState((prev) => ({ ...prev, price }));
  };

  if (!asset) return null;

  const renderContent = () => {
    switch (state.step) {
      case EBidStep.InputPrice:
        return (
          <BidInputStep
            asset={asset}
            onCancel={() => {
              onClose();
            }}
            onConfirm={() => {
              // go to next step and get approval for the token and amount selected
              setState((prevState) => ({
                ...prevState,
                step: EBidStep.GetApprovalInfo,
              }));
            }}
            price={state.price}
            updatePrice={updatePrice}
          />
        );
      case EBidStep.GetApprovalInfo:
        return (
          <BidGetInfoStep
            onConfirm={(isUnlocked: boolean) => {
              if (!isUnlocked) {
                setState((prevState) => ({
                  ...prevState,
                  step: EBidStep.SetApproval,
                }));
              } else {
                setState((prevState) => ({
                  ...prevState,
                  step: EBidStep.PlaceBid,
                }));
              }
            }}
            tokenAddress={state.price.token.address}
            tokenAmount={state.price.amount}
          />
        );
      case EBidStep.SetApproval:
        return (
          <BidApprovalStep
            onConfirm={() => {
              setState((prevState) => ({
                ...prevState,
                step: EBidStep.PlaceBid,
              }));
            }}
            tokenAddress={state.price.token.address}
            tokenAmount={state.price.amount}
          />
        );
      case EBidStep.PlaceBid:
        return (
          <PlaceBidStep
            asset={asset}
            onConfirm={async () => {
              setState((prevState) => ({
                ...prevState,
                step: EBidStep.Success,
              }));
              await onSuccess();
              onClose();
            }}
            price={{
              ...state.price,
              amount: EthersBigNumberTo0xBigNumber(state.price.amount),
            }}
          />
        );
      case EBidStep.Success:
        return <BidSuccessStep title={"Your bid is placed successfully"} />;
      default:
        return null;
    }
  };

  return (
    <TradeBasicModal onClose={onClose} title="Place Bid" visible={visible}>
      {renderContent()}
    </TradeBasicModal>
  );
};
