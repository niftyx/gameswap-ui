import { BigNumber } from "@0x/utils";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { getLogger } from "utils/logger";
import { buildBidCollectibleOrder, submitCollectibleOrder } from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { IAssetItem, IToken, NetworkId } from "utils/types";

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
  asset: IAssetItem;
  price: {
    amount: BigNumber;
    token: IToken;
  };
}

interface IState {
  loading: boolean;
  error: string;
}

export const PlaceBidStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { asset, onConfirm } = props;

  const placeBid = async () => {
    const { account, networkId } = context;
    if (!account || !networkId || !context.library) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const signedOrder = await buildBidCollectibleOrder(
        {
          erc20Address: props.price.token.address,
          price: props.price.amount,
          account: context.account || "",

          erc721: asset.collectionId,
          tokenId: EthersBigNumberTo0xBigNumber(asset.tokenId),
          amount: new BigNumber(1),

          exchangeAddress: get0xContractAddresses(networkId).exchange,
        },
        networkId as NetworkId,
        context.library.provider
      );
      await submitCollectibleOrder(signedOrder, networkId as NetworkId);

      logger.log("submitResult::Success");

      onConfirm();

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("placeBid", error);
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
        {state.loading && <CommentLoader comment="Placing a bid..." />}
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
