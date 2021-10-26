import { BigNumber } from "@ethersproject/bignumber";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { TokenAmountInput } from "components/Input";
import { useConnectedWeb3Context } from "contexts";
import { useBalances } from "helpers";
import { transparentize } from "polished";
import React from "react";
import { formatBigNumber, shortenAddress } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { IAssetItem, IToken, ITokenAmount } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  description: {
    color: theme.colors.white,
    fontSize: 14,
    lineHeight: "24px",
    marginBottom: 48,
    "& span": {
      color: theme.colors.white,
      fontSize: 16,
    },
  },
  balance: {
    color: theme.colors.primary40,
    fontSize: 14,
    marginTop: 16,
  },
  place: {
    height: theme.spacing(5),
    marginTop: theme.spacing(6),
  },
  cancel: {
    height: theme.spacing(5),
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.white),
    },
  },
}));

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  asset: IAssetItem;
  updatePrice: (_: ITokenAmount) => void;
  className?: string;
  price: {
    amount: BigNumber;
    token: IToken;
  };
}

export const BidInputStep = (props: IProps) => {
  const { asset, onCancel, onConfirm, price, updatePrice } = props;
  const classes = useStyles();
  const context = useConnectedWeb3Context();
  const {
    balances: { erc20Balances },
  } = useBalances(context);
  const isConnected = !!context.account;

  const hasEnoughBalance = (erc20Balances as any)[
    props.price.token.symbol.toLowerCase()
  ].gte(props.price.amount);

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography align="left" className={classes.description}>
        You are about to place a bid for <span>“{asset.name}”</span> from{" "}
        <span>{shortenAddress(asset.ownerId)}</span>.
      </Typography>
      <TokenAmountInput onChange={updatePrice} value={price} />
      <Typography align="right" className={classes.balance}>
        Your balance:{" "}
        {formatBigNumber(
          (erc20Balances as any)[price.token.symbol.toLowerCase()],
          price.token.decimals
        )}
      </Typography>
      <Button
        className={classes.place}
        color="primary"
        disabled={price.amount.eq(ZERO_NUMBER) || !hasEnoughBalance}
        fullWidth
        onClick={() => {
          if (isConnected) {
            onConfirm();
          } else {
            context.setWalletConnectModalOpened(true);
          }
        }}
        variant="contained"
      >
        {isConnected
          ? !hasEnoughBalance
            ? "INSUFFICIENT BALANCE TO PLACE BID"
            : "PLACE BID"
          : "CONNECT WALLET"}
      </Button>
      <Button
        className={classes.cancel}
        fullWidth
        onClick={onCancel}
        variant="contained"
      >
        CANCEL
      </Button>
    </div>
  );
};
