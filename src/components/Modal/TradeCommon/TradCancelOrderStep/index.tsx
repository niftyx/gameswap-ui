import { SignedOrder } from "@0x/types";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { waitSeconds } from "utils";
import { getLogger } from "utils/logger";
import { cancelOrder } from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";

const logger = getLogger("TradeSellAssetStep::");

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  button: {
    height: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
}));

interface IProps {
  onConfirm: () => void;
  className?: string;
  order: SignedOrder;
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradCancelOrderStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { onConfirm, order } = props;

  const sellAsset = async () => {
    const { account, networkId } = context;
    if (!account || !networkId || !context.library) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const gasPrice = await context.library.getGasPrice();

      const txHash = await cancelOrder(
        context.library.provider,
        order,
        account,
        EthersBigNumberTo0xBigNumber(gasPrice),
        networkId
      );
      await context.library.waitForTransaction(txHash);
      logger.log("submitResult::Success");

      await waitSeconds(3);

      onConfirm();

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
    sellAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        {state.loading && <CommentLoader comment="Cancelling a order..." />}
        {!state.loading && !state.error && (
          <CommentLoader comment="Redirecting..." />
        )}
        <ErrorText error={state.error} />
      </div>

      {!state.loading && state.error && (
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={sellAsset}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
