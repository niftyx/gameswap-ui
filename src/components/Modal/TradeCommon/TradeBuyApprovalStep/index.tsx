import { assetDataUtils } from "@0x/order-utils";
import { SignedOrder } from "@0x/types";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { ERC20Service } from "services";
import { getLogger } from "utils/logger";
import { xBigNumberToEthersBigNumber } from "utils/token";

const logger = getLogger("TradeBuyApprovalStep::");

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

export const TradeBuyApprovalStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { onConfirm, order } = props;

  const approve = async () => {
    const { account, contractWrappers, networkId } = context;
    if (!account || !networkId || !contractWrappers) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const operator = get0xContractAddresses(networkId).erc20Proxy;
      const assetTakerInfo = assetDataUtils.decodeAssetDataOrThrow(
        order.takerAssetData
      );
      const erc20Service = new ERC20Service(
        context.library,
        context.account,
        (assetTakerInfo as any).tokenAddress
      );
      await erc20Service.approve(
        operator,
        xBigNumberToEthersBigNumber(order.takerAssetAmount)
      );

      onConfirm();

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("approve", error);
      setState((prevState) => ({
        ...prevState,
        error: error.message || "Something went wrong!",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    approve();
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.loading && <CommentLoader comment="Approving token..." />}
      <ErrorText error={state.error} />
      {!state.loading && state.error && (
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={approve}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
