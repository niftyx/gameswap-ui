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
import { cancelOrder } from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { IAssetItem, NetworkId } from "utils/types";

const logger = getLogger("TradeSellAssetStep::");

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
  const { erc721 } = useContracts(context);
  const { onConfirm, order } = props;

  const sellAsset = async () => {
    const { account, networkId } = context;
    if (!account || !networkId || !context.library || !context.contractWrappers)
      return;
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
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.loading && <CommentLoader comment="Cancelling a order..." />}
      {!state.loading && !state.error && (
        <CommentLoader comment="Redirecting..." />
      )}
      <ErrorText error={state.error} />
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
