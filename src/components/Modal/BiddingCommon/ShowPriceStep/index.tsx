import { BigNumber } from "@ethersproject/bignumber";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PRICE_DECIMALS } from "config/constants";
import { useGlobal } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { formatBigNumber } from "utils";
import { IAssetItem, IToken } from "utils/types";

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
  priceWrapper: {
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.white}`,
  },
  priceToken: {
    fontSize: 20,
    color: theme.colors.white,
  },
  priceUsd: { fontSize: 20, color: theme.colors.primary40 },
}));

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  asset: IAssetItem;
  className?: string;
  price: {
    amount: BigNumber;
    token: IToken;
  };
}

export const ShowPriceStep = (props: IProps) => {
  const { onCancel, onConfirm, price } = props;
  const classes = useStyles();
  const { amount, token } = price;
  const {
    data: { price: tokenPrice },
  } = useGlobal();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography align="left" className={classes.description}>
        {/* You are about to bid for <span>“{asset.name}”</span> from{" "}
        <span>{shortenAddress(asset.owner)}</span>. */}
      </Typography>
      <div className={classes.priceWrapper}>
        <span className={classes.priceToken}>
          {formatBigNumber(amount, token.decimals)} {token.symbol}
        </span>
        <span className={classes.priceUsd}>
          $
          {formatBigNumber(
            amount.mul((tokenPrice as any)[token.symbol.toLowerCase()].price),
            token.decimals + PRICE_DECIMALS
          )}{" "}
          USD
        </span>
      </div>
      <Button
        className={classes.place}
        color="primary"
        fullWidth
        onClick={() => {
          onConfirm();
        }}
        variant="contained"
      >
        ACCEPT BID
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
