import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PRICE_DECIMALS, SERVICE_FEE_IN_PERCENT } from "config/constants";
import { transparentize } from "polished";
import React from "react";
import Identicon from "react-identicons";
import { formatBigNumber, numberWithCommas, shortenAddress } from "utils";
import { xBigNumberToEthersBigNumber } from "utils/token";
import {
  IGlobalPriceData,
  ISignedOrder,
  IToken,
  KnownToken,
} from "utils/types";

const IdenticonComponent = Identicon as any;

const AVATAR_SIZE = 32;

const useStyles = makeStyles((theme) => ({
  root: {},
  main: {
    padding: "12px 32px",
    backgroundColor: transparentize(0.9, theme.colors.white),
    borderRadius: 4,
    border: `1px solid ${theme.colors.white}`,
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: "50%",
    overflow: "hidden",
  },
  bidder: {
    color: theme.colors.white,
    fontSize: 14,
    margin: "0 24px",
    flex: 1,

    "& span": {
      color: theme.colors.white,
    },
  },
  priceWrapper: {},
  priceUsd: {
    fontSize: 20,
    color: theme.colors.white,
    lineHeight: "23px",
  },
  priceToken: {
    fontSize: 14,
    color: theme.colors.white,
    lineHeight: "23px",
  },
  fee: {
    marginTop: 16,
    color: theme.colors.white,
    fontSize: 14,
    marginBottom: 16,
    "& span": {
      color: theme.colors.primary40,
    },
  },
}));

interface IProps {
  className?: string;
  price: { [key in KnownToken]: IGlobalPriceData };
  bid: ISignedOrder;
  token: IToken;
}

export const HighestBidInfo = (props: IProps) => {
  const classes = useStyles();
  const { bid, price, token } = props;

  const priceUsd = (price as any)[token.symbol.toLowerCase()].price.mul(
    xBigNumberToEthersBigNumber(bid.makerAssetAmount)
  );
  const feeUsd = (price as any)[token.symbol.toLowerCase()].price.mul(
    xBigNumberToEthersBigNumber(bid.takerFee)
  );

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.main}>
        <div className={classes.avatar}>
          <IdenticonComponent
            bg="#FFF"
            size={AVATAR_SIZE}
            string={bid.makerAddress}
          />
        </div>
        <Typography align="left" className={classes.bidder}>
          Highest bid by <span>{shortenAddress(bid.makerAddress)}</span>
        </Typography>
        <div className={classes.priceWrapper}>
          <Typography align="right" className={classes.priceUsd}>
            $
            {numberWithCommas(
              Number(formatBigNumber(priceUsd, token.decimals + PRICE_DECIMALS))
            )}
          </Typography>
          <Typography align="right" className={classes.priceToken}>
            {numberWithCommas(
              Number(
                formatBigNumber(
                  xBigNumberToEthersBigNumber(bid.makerAssetAmount),
                  token.decimals
                )
              )
            )}
            &nbsp;
            {token.symbol}
          </Typography>
        </div>
      </div>
      <Typography align="center" className={classes.fee}>
        Service fee&nbsp;
        <span>
          {SERVICE_FEE_IN_PERCENT}% - $
          {numberWithCommas(
            Number(formatBigNumber(feeUsd, token.decimals + PRICE_DECIMALS))
          )}
        </span>
        &nbsp;
        {numberWithCommas(
          Number(
            formatBigNumber(
              xBigNumberToEthersBigNumber(bid.takerFee),
              token.decimals
            )
          )
        )}
        &nbsp;
        {token.symbol}
      </Typography>
    </div>
  );
};
