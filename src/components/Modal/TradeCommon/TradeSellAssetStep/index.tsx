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
import { buildSellCollectibleOrder, submitCollectibleOrder } from "utils/order";
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
  asset: IAssetItem;
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradeSellAssetStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { erc721 } = useContracts(context);
  const { asset, onConfirm } = props;

  const sellAsset = async () => {
    const { account, networkId } = context;
    if (
      !account ||
      !networkId ||
      !asset.price ||
      !asset.tokenId ||
      !context.library ||
      !context.contractWrappers
    )
      return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const signedOrder = await buildSellCollectibleOrder(
        {
          erc721: erc721.address,
          tokenId: EthersBigNumberTo0xBigNumber(asset.tokenId),
          account: context.account || "",
          amount: new BigNumber(1),
          exchangeAddress: get0xContractAddresses(networkId).exchange,
          erc20Address: asset.price.token.address,
          price: EthersBigNumberTo0xBigNumber(asset.price.amount),
        },
        networkId as NetworkId,
        context.library.provider
      );
      logger.log("signedOrder::", signedOrder);
      await submitCollectibleOrder(signedOrder, networkId as NetworkId);

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
      {state.loading && <CommentLoader comment="Creating a sell order..." />}
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
