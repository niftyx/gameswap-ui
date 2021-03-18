import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BidderAvatarRowItem } from "components";
import {
  DEFAULT_NETWORK_ID,
  PRICE_DECIMALS,
  SERVICE_FEE,
  SERVICE_FEE_IN_PERCENT,
} from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "packages/ethers";
import { transparentize } from "polished";
import React from "react";
import { formatBigNumber } from "utils";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { IAssetItem, KnownToken } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    zIndex: 10,
    bottom: 0,
    backgroundColor: transparentize(0.9, theme.colors.text.secondary),
    backdropFilter: "blur(20px)",
    boxShadow: "rgb(18 18 18 / 90%) 0px -14px 40px",
  },
  content: {
    padding: "16px 24px",
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
  buyNow: {
    height: theme.spacing(6),
    flex: 1,
    fontSize: theme.spacing(2.25),
    [theme.breakpoints.down("xs")]: {
      minWidth: theme.spacing(25),
      height: theme.spacing(6),
    },
  },
  bid: {
    height: theme.spacing(6),
    flex: 1,
    fontSize: theme.spacing(2.25),
    backgroundColor: transparentize(0.4, theme.colors.text.secondary),
    [theme.breakpoints.down("xs")]: {
      minWidth: theme.spacing(25),
      height: theme.spacing(6),
    },
  },
  comment: {
    marginTop: 16,
    color: transparentize(0.4, theme.colors.text.default),
    "& span": {
      color: theme.colors.text.default,
    },
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
  onBuy: () => void;
}

export const BuySection = (props: IProps) => {
  const classes = useStyles();
  const {
    data: { price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();
  const { data, onBuy } = props;
  if (!data.orders || data.orders.length === 0) return null;

  const [order] = data.orders;

  const token = getTokenFromAddress(
    networkId || DEFAULT_NETWORK_ID,
    order.erc20Address
  );
  const tokenPrice = price[token.symbol.toLowerCase() as KnownToken];
  const tokenAmount = xBigNumberToEthersBigNumber(order.takerAssetAmount);

  const USDPrice = tokenPrice.price.mul(tokenAmount);

  const tokenAmountIncludingFee = tokenAmount
    .mul(BigNumber.from(Math.floor((1 + SERVICE_FEE) * 1000)))
    .div(BigNumber.from("1000"));
  const USDPriceIncludingFee = USDPrice.mul(
    BigNumber.from(Math.floor((1 + SERVICE_FEE) * 1000))
  ).div(BigNumber.from("1000"));

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <BidderAvatarRowItem
          // address={order.takerAddress}
          address={order.erc20Address}
          comment1="Highest bid by"
          tokenPrice={`${formatBigNumber(tokenAmount, token.decimals, 3)} ${
            token.symbol
          }`}
          usdPrice={`$${formatBigNumber(
            USDPrice,
            token.decimals + PRICE_DECIMALS,
            2
          )}`}
        />
        <div className={classes.buttonRow}>
          <Button
            className={classes.buyNow}
            color="primary"
            onClick={onBuy}
            variant="contained"
          >
            Buy now
          </Button>
          <Button className={classes.bid} color="secondary" variant="contained">
            Bid
          </Button>
        </div>
        <Typography align="center" className={classes.comment}>
          Service fee <span>{SERVICE_FEE_IN_PERCENT}%</span>.{" "}
          {formatBigNumber(tokenAmountIncludingFee, token.decimals, 3)}
          &nbsp;&nbsp;
          {token.symbol}&nbsp;&nbsp; $
          {formatBigNumber(
            USDPriceIncludingFee,
            token.decimals + PRICE_DECIMALS
          )}
        </Typography>
      </div>
    </div>
  );
};
