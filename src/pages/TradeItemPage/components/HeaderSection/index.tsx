import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { AssetMorePopover, AssetSharePopover } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { getAssetObjectWithPrices } from "utils/tools";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 24,
  },
  headerRight: { display: "flex", "& > * + *": { marginLeft: 8 } },
  title: {
    left: theme.spacing(2),
    top: theme.spacing(4),
    color: theme.colors.text.default,
    fontSize: theme.spacing(3.25),
  },
  gameType: {
    fontSize: theme.spacing(2.25),
    color: theme.colors.text.sixth,
  },
  description: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.sixth,
    maxWidth: 500,
  },
  priceRow: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  priceUsd: {
    fontSize: theme.spacing(2.5),
    color: transparentize(0.3, theme.colors.text.default),
    maxWidth: 500,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(2),
    },
  },
  tokenPrice: {
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.default,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(2),
    },
  },
}));

interface IProps {
  data: IAssetItem;
  className?: string;
}
export const HeaderSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { data } = props;
  const {
    data: { games, price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();

  const assetDataWithPriceInfo = getAssetObjectWithPrices(
    data,
    data.orders || [],
    price,
    networkId || DEFAULT_NETWORK_ID
  );

  const game = games.find((e) => e.id === data.gameId);
  const isInSale = (data.orders || []).length > 0;

  return (
    <div className={clsx(classes.header, props.className)}>
      <div className={classes.headerLeft}>
        <Typography className={classes.title} component="div">
          {data.name}
        </Typography>
        {game && (
          <Typography className={classes.gameType} component="div">
            {game.title}
          </Typography>
        )}
        {data.description && (
          <Typography className={classes.description} component="div">
            {data.description}
          </Typography>
        )}
        {isInSale && (
          <div>
            <div className={clsx(commonClasses.row, classes.priceRow)}>
              <Typography className={classes.tokenPrice} component="div">
                {assetDataWithPriceInfo.minTokenAmountString}
              </Typography>
              <Typography className={classes.priceUsd} component="div">
                ${assetDataWithPriceInfo.minUSDPrice} 1 of 1
              </Typography>
            </div>
          </div>
        )}
      </div>
      <div className={classes.headerRight}>
        <AssetMorePopover />
        <AssetSharePopover />
      </div>
    </div>
  );
};
