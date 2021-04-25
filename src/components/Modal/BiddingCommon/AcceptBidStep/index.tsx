import { BigNumber } from "@0x/utils";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { getLogger } from "utils/logger";
import { submitBuyCollectible } from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { IAssetItem, ISignedOrder } from "utils/types";

const logger = getLogger("PlaceBidStep::");

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
  bid: ISignedOrder;
}

interface IState {
  loading: boolean;
  error: string;
}

export const AcceptBidStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { bid, onConfirm } = props;

  const placeBid = async () => {
    const { account, networkId } = context;
    if (!account || !networkId || !context.library) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const gasPrice = await context.library.getGasPrice();

      const txHash = await submitBuyCollectible(
        context.library.provider,
        bid,
        account,
        EthersBigNumberTo0xBigNumber(gasPrice),
        networkId
      );

      await context.library.waitForTransaction(txHash);
      logger.log("accept Bid::Success");

      onConfirm();

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("acceptBid", error);
      setState((prevState) => ({
        ...prevState,
        error: error.message || "Something went wrong!",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    placeBid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        {state.loading && <CommentLoader comment="Accepting bid..." />}
        {!state.loading && !state.error && <CommentLoader comment="" />}
        <ErrorText error={state.error} />
      </div>

      {!state.loading && state.error && (
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={placeBid}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
