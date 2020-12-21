import { SignedOrder } from "@0x/types";
import { BigNumber } from "@0x/utils";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useContracts } from "helpers";
import React, { useEffect, useState } from "react";
import { getLogger } from "utils/logger";
import {
  buildSellCollectibleOrder,
  submitBuyCollectible,
  submitCollectibleOrder,
} from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { IAssetItem } from "utils/types";

const logger = getLogger("TradeBuyAssetStep::");

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  button: {
    height: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
}));

interface IProps {
  onConfirm: () => void;
  className?: string;
  asset: IAssetItem;
  order: SignedOrder;
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradeBuyAssetStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { erc721 } = useContracts(context);
  const { asset, onConfirm, order } = props;

  const buyAsset = async () => {
    const { account, networkId } = context;
    if (
      !account ||
      !networkId ||
      !context.library ||
      !context.contractWrappers ||
      !context.web3Wrapper
    )
      return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const gasPrice = await context.library.getGasPrice();

      const txHash = await submitBuyCollectible(
        context.contractWrappers,
        context.web3Wrapper,
        order,
        account,
        EthersBigNumberTo0xBigNumber(gasPrice),
        networkId
      );

      await context.web3Wrapper.awaitTransactionSuccessAsync(txHash);
      logger.log("buy Asset::Success");

      // onConfirm();

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("sellAsset", error);
      setState((prevState) => ({
        ...prevState,
        error: error.message || "Something went wrong!",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    buyAsset();
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.loading && <CommentLoader comment="Filling order..." />}
      {!state.loading && !state.error && (
        <CommentLoader comment="Redirecting..." />
      )}
      <ErrorText error={state.error} />
      {!state.loading && state.error && (
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={buyAsset}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
