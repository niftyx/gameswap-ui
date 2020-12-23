import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useContracts } from "helpers";
import React, { useEffect, useState } from "react";
import { getLogger } from "utils/logger";

const logger = getLogger("TradeSellGetInfoStep::");

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
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradeSellGetInfoStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const { erc721 } = useContracts(context);
  const { onConfirm } = props;

  const getInfo = async () => {
    const { account, contractWrappers, networkId } = context;
    if (!account || !networkId || !contractWrappers) return;
    setState((prevState) => ({
      ...prevState,
      error: "",
      loading: true,
    }));
    try {
      // get approval information
      const operator = get0xContractAddresses(networkId).erc721proxy;
      const isUnlocked = await erc721.isApprovedForAll(account || "", operator);

      logger.log("isUnlocked::", isUnlocked);

      onConfirm(isUnlocked);

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
      {state.loading && <CommentLoader comment="Checking if unlocked..." />}
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
