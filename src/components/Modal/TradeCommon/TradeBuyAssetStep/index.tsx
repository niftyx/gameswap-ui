import { SignedOrder } from "@0x/types";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { useConnectedWeb3Context } from "contexts";
import { useContracts } from "helpers";
import React, { useEffect, useState } from "react";
import { getLogger } from "utils/logger";
import { submitBuyCollectible } from "utils/order";
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
  const { onConfirm, order } = props;

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
        context.library.provider,
        order,
        account,
        EthersBigNumberTo0xBigNumber(gasPrice),
        networkId
      );

      await context.library.waitForTransaction(txHash);
      logger.log("buy Asset::Success");

      onConfirm();

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("sellAsset", error);
      logger.error(JSON.stringify(error));
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
