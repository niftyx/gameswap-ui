import { SignedOrder, assetDataUtils } from "@0x/order-utils";
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

const logger = getLogger("TradeBuyGetInfoStep::");

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
  onConfirm: (_: boolean) => void;
  className?: string;
  order: SignedOrder;
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradeBuyGetInfoStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { onConfirm, order } = props;

  const getInfo = async () => {
    const { account, library, networkId } = context;
    if (!account || !networkId || !library) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      // get approval information
      const operator = get0xContractAddresses(networkId).erc20Proxy;
      const assetTakerInfo = assetDataUtils.decodeAssetDataOrThrow(
        order.takerAssetData
      );
      const erc20Service = new ERC20Service(
        context.library,
        context.account,
        (assetTakerInfo as any).tokenAddress
      );
      const isApproved = await erc20Service.hasEnoughAllowance(
        account,
        operator,
        xBigNumberToEthersBigNumber(order.takerAssetAmount)
      );

      logger.log("isApproved::", isApproved);

      onConfirm(isApproved);

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("getInfo", error);
      setState((prevState) => ({
        ...prevState,
        error: error.message || "Something went wrong!",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.loading && <CommentLoader comment="Checking if approved..." />}
      <ErrorText error={state.error} />
      {!state.loading && state.error && (
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={getInfo}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
