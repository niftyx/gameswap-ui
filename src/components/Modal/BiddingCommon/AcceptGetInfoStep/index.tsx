import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CommentLoader } from "components/Loader";
import { ErrorText } from "components/Text";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "packages/ethers";
import React, { useEffect, useState } from "react";
import { ERC20Service, ERC721Service } from "services";
import { getLogger } from "utils/logger";

const logger = getLogger("AcceptGetInfoStep::");

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
  onConfirm: (erc721Confirmed: boolean, erc20Confirmed: boolean) => void;
  className?: string;
  collectionId: string;
  collectionAmount: BigNumber;
  tokenAddress: string;
  tokenAmount: BigNumber;
}

interface IState {
  loading: boolean;
  error: string;
}

export const AcceptGetInfoStep = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ loading: false, error: "" });
  const context = useConnectedWeb3Context();
  const erc721 = new ERC721Service(
    context.library,
    context.account || "",
    props.collectionId
  );
  const erc20 = new ERC20Service(
    context.library,
    context.account || "",
    props.tokenAddress
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
      const zeroAddresses = get0xContractAddresses(networkId);

      const isERC721Unlocked = await erc721.isApprovedForAll(
        account || "",
        zeroAddresses.erc721proxy
      );

      logger.log("isERC721Unlocked::", isERC721Unlocked);

      const isERC20Unlocked = await erc20.hasEnoughAllowance(
        account || "",
        zeroAddresses.erc20Proxy,
        props.tokenAmount
      );

      onConfirm(isERC721Unlocked, isERC20Unlocked);

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
