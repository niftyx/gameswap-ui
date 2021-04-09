import { Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder } from "assets/icons";
import { ReactComponent as HeartIcon } from "assets/svgs/heart.svg";
import clsx from "clsx";
import { useAssetDetailsFromInventoryItem, useAssetOrders } from "helpers";
import React from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";
import { getLogger } from "utils/logger";
import { MAX_NUMBER } from "utils/number";
import {
  EthersBigNumberTo0xBigNumber,
  xBigNumberToEthersBigNumber,
} from "utils/token";
import { IAssetItem } from "utils/types";

import { AssetPhoto } from "../AssetPhoto";

// eslint-disable-next-line
const logger = getLogger("InventoryAssetItem::");

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    position: "relative",
    userSelect: "none",
    padding: 8,
    backgroundColor: theme.colors.background.eleventh,
    borderRadius: 4,
    overflow: "hidden",
    transition: "all 0.4s",
    border: `2px solid ${theme.colors.transparent}`,
    "&.selected": {
      borderColor: theme.colors.background.fourth,
    },
    "& .game-details-place-bid": {
      position: "absolute",
      bottom: 16,
      opacity: 0,
      overflow: "hidden",
      transition: "all 0.4s",
      zIndex: -1,
    },
    "&:hover": {
      backgroundColor: theme.colors.background.twelfth,
      "& .game-details-place-bid": {
        width: "auto",
        opacity: 1,
        zIndex: 5,
      },
    },
  },
  placeholder: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    zIndex: 10,
    padding: theme.spacing(1),
  },
  imgWrapper: {
    position: "relative",
    width: "100%",
    paddingTop: "100%",
    backgroundColor: theme.colors.background.sixth,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 16,
    right: 16,
    width: 26,
    height: 26,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: "50%",
    zIndex: 3,
    "& svg": {
      color: theme.colors.text.heart,
      width: 16,
      height: 16,
    },
  },
  bottom: {},
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: theme.colors.text.default,
    marginTop: 8,
  },
  topBid: { color: theme.colors.text.secondary, fontSize: 13 },
  price: { color: theme.colors.text.default },
  count: { color: theme.colors.text.secondary },
}));

interface IProps {
  data: IGraphInventoryAsset;
  className?: string;
  isFullWidth?: boolean;
  onClick?: (_: IAssetItem) => void;
  onMore?: () => void;
  selected?: boolean;
}

export const InventoryAssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const {
    data,
    isFullWidth = false,
    onClick,
    onMore,
    selected = false,
  } = props;
  const { asset, loaded } = useAssetDetailsFromInventoryItem(data);
  const { asks, bids, loading: assetsLoading } = useAssetOrders(
    data.collectionId,
    EthersBigNumberTo0xBigNumber(data.assetId),
    data.owner
  );

  const responsive = isFullWidth
    ? { xl: 2, lg: 2, md: 4, xs: 6 }
    : { xl: 3, lg: 4, md: 6, xs: 6 };

  const onClickDetails = () => {
    if (asset && onClick) {
      const maxOrder = asks.find((order) =>
        xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
      );
      const orders = asks.filter(
        (order) =>
          !xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
      );
      onClick({ ...asset, maxOrder, orders, bids });
    }
  };

  const allLoaded = loaded && !assetsLoading;

  return (
    <Grid
      className={clsx(classes.root, props.className)}
      item
      {...(responsive as any)}
    >
      <div className={clsx(classes.content, selected ? "selected" : "")}>
        {!allLoaded && (
          <div className={classes.placeholder}>
            <IconAssetPlaceholder />
          </div>
        )}
        <div
          className={clsx(
            classes.imgWrapper,
            commonClasses.fadeAnimation,
            allLoaded ? "visible" : ""
          )}
          onClick={onClickDetails}
        >
          {asset && asset.image && (
            <AssetPhoto
              className={classes.img}
              type={asset.imageType}
              uri={asset.image}
            />
          )}
          {/* <div className={classes.heart}>
            <HeartIcon />
          </div> */}
        </div>
        <div
          className={clsx(
            classes.bottom,
            commonClasses.fadeAnimation,
            allLoaded ? "visible" : ""
          )}
        >
          <Typography className={classes.title}>
            {allLoaded ? asset?.name : " "}&nbsp;
          </Typography>
          <div className={classes.bottomRow}>
            <Typography className={classes.price}>0.7 ETH</Typography>
            <Typography className={classes.count}>1 of 1</Typography>
          </div>
          <Typography className={classes.topBid}>Bid 0.54</Typography>
        </div>
      </div>
    </Grid>
  );
};
