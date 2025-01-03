import { BigNumber } from "@ethersproject/bignumber";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { ERC20Service } from "services";
import { getLogger } from "utils/logger";

const logger = getLogger("BidApprovalStep::");

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
  tokenAddress: string;
  tokenAmount: BigNumber;
}

interface IState {
  loading: boolean;
  error: string;
}

export const BidApprovalStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const erc20 = new ERC20Service(
    context.library,
    context.account || "",
    props.tokenAddress
  );

  const { onConfirm } = props;

  const approveAll = async () => {
    const { account, networkId } = context;
    if (!account || !networkId) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const operator = get0xContractAddresses(networkId).erc20Proxy;
      logger.log("operator::", operator);
      await erc20.approveUnlimited(operator);

      onConfirm();

      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      logger.error("approveAll", error);
      setState((prevState) => ({
        ...prevState,
        error: error.message || "Something went wrong!",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    approveAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        {state.loading && <CommentLoader comment="Unlocking asset..." />}
        <ErrorText error={state.error} />
      </div>

      {!state.loading && state.error && (
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={approveAll}
          variant="contained"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
