import { SignedOrder } from "@0x/types";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { waitSeconds } from "utils";
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
        order,
        account,
        EthersBigNumberTo0xBigNumber(gasPrice),
        networkId
      );

      await context.library.waitForTransaction(txHash);
      logger.log("buy Asset::Success");

      await waitSeconds(5);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        {state.loading && <CommentLoader comment="Filling order..." />}
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
          onClick={buyAsset}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
