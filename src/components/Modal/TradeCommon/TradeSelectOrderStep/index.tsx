import { SignedOrder } from "@0x/types";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { useGlobal } from "contexts";
import React from "react";
import useCommonStyles from "styles/common";
import { formatBigNumber } from "utils";
import { IAssetItem, ITokenAmount, IUSDPriceTokenSymbol } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  img: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    margin: theme.spacing(2),
  },
  prices: {
    maxHeight: "30vh",
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.3s",
    "&:hover": {
      opacity: 0.7,
    },
    "& + &": {
      marginTop: theme.spacing(1),
    },
  },
  itemPrice: {
    color: theme.colors.text.default,
  },
  itemBuy: {
    height: theme.spacing(5),
  },
}));

interface IProps {
  onConfirm: (_: SignedOrder) => void;
  asset: IAssetItem;
  className?: string;
}

export const TradeSelectOrderStep = (props: IProps) => {
  const { asset, onConfirm } = props;
  const {
    data: { price },
  } = useGlobal();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  if (!asset.prices) return null;

  return (
    <div className={clsx(classes.root, props.className)}>
      {asset.base64 && (
        <img alt="asset-img" className={classes.img} src={asset.base64} />
      )}
      <div className={clsx(classes.prices, commonClasses.scroll)}>
        {asset.prices.map((tPrice: ITokenAmount, priceIndex: number) => {
          const loadedUSDPrice =
            price[tPrice.token.symbol.toLowerCase() as IUSDPriceTokenSymbol];

          return (
            <div className={classes.item} key={priceIndex}>
              <Typography className={classes.itemPrice} component="span">
                {formatBigNumber(tPrice.amount, tPrice.token.decimals)}&nbsp;
                {tPrice.token.symbol}
                ($&nbsp;
                {formatBigNumber(
                  tPrice.amount.mul(loadedUSDPrice.price),
                  tPrice.token.decimals + loadedUSDPrice.decimals
                )}
                )
              </Typography>
              <Button
                className={classes.itemBuy}
                color="primary"
                onClick={() => {
                  const { orders } = asset;
                  if (orders && orders[priceIndex]) {
                    onConfirm(orders[priceIndex]);
                  }
                }}
                variant="contained"
              >
                BUY
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
