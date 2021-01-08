import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useContracts } from "helpers";
import React, { useEffect, useState } from "react";
import { getLogger } from "utils/logger";

const logger = getLogger("TradeSellApprovalStep::");

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
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradeSellApprovalStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { erc721 } = useContracts(context);
  const { onConfirm } = props;

  const approveAll = async () => {
    const { account, contractWrappers, networkId } = context;
    if (!account || !networkId || !contractWrappers) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      const operator = get0xContractAddresses(networkId).erc721proxy;
      logger.log("operator::", operator);
      await erc721.approveForAll(operator, true);

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
      {state.loading && <CommentLoader comment="Unlocking asset..." />}
      <ErrorText error={state.error} />
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
