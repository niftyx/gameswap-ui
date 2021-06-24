import { SignedOrder } from "@0x/types";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useBalances } from "helpers";
import { useSnackbar } from "notistack";
import React from "react";
import useCommonStyles from "styles/common";
import { formatBigNumber } from "utils";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { IAssetItem, ITokenAmount, KnownToken } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  img: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    margin: `${theme.spacing(2)}px auto`,
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
  onCancel: (_: SignedOrder) => void;
  asset: IAssetItem;
  className?: string;
}

export const TradeSelectOrderStep = (props: IProps) => {
  const { asset, onCancel, onConfirm } = props;
  const {
    data: { price },
  } = useGlobal();
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const context = useConnectedWeb3Context();
  const { account } = context;
  const {
    balances: { erc20Balances },
  } = useBalances(context);
  const { enqueueSnackbar } = useSnackbar();

  if (!asset.prices) return null;

  const isMine =
    asset.ownerId &&
    account &&
    asset.ownerId.toLowerCase() === account.toLowerCase();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={clsx(classes.prices, commonClasses.scroll)}>
        {asset.prices.map((tPrice: ITokenAmount, priceIndex: number) => {
          const loadedUSDPrice =
            price[tPrice.token.symbol.toLowerCase() as KnownToken];

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
                    if (isMine) {
                      return onCancel(orders[priceIndex]);
                    }
                    const erc20Token = getTokenFromAddress(
                      context.networkId || DEFAULT_NETWORK_ID,
                      orders[priceIndex].erc20Address
                    );
                    if (
                      xBigNumberToEthersBigNumber(
                        orders[priceIndex].takerAssetAmount
                      ).gt(
                        erc20Balances[
                          erc20Token.symbol.toLowerCase() as KnownToken
                        ]
                      )
                    ) {
                      enqueueSnackbar("Insufficient balance", {
                        variant: "error",
                      });
                      return;
                    }
                    onConfirm(orders[priceIndex]);
                  }
                }}
                variant="contained"
              >
                {isMine ? "Cancel" : "Buy"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
