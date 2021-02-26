import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React, { useEffect, useState } from "react";
import { ERC721Service } from "services";
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
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
}));

interface IProps {
  onConfirm: (_: boolean) => void;
  className?: string;
  collectionId: string;
}

interface IState {
  loading: boolean;
  error: string;
}

export const TradeSellGetInfoStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const erc721 = new ERC721Service(
    context.library,
    context.account || "",
    props.collectionId
  );
  const { onConfirm } = props;

  const getInfo = async () => {
    const { account, networkId } = context;
    if (!account || !networkId) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        {state.loading && <CommentLoader comment="Checking if unlocked..." />}
        <ErrorText error={state.error} />
      </div>

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
