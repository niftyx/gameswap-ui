import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder } from "assets/icons";
import { ReactComponent as HeartIcon } from "assets/svgs/heart.svg";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useAssetBids, useAssetDetailsFromIdCollection } from "helpers";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { MAX_NUMBER } from "utils/number";
import {
  EthersBigNumberTo0xBigNumber,
  xBigNumberToEthersBigNumber,
} from "utils/token";
import { getAssetObjectWithPrices } from "utils/tools";
import { IAssetItem, ITradeAssetItem } from "utils/types";

import { AssetPhoto } from "../AssetPhoto";

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
  data: ITradeAssetItem;
  className?: string;
  isFullWidth?: boolean;
  onClick?: (_: IAssetItem) => void;
  onMore?: (_: string) => void;
  isOnCart?: boolean;
  selected?: boolean;
}

export const TradeAssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const {
    data,
    isFullWidth = false,
    // isOnCart = false,
    onClick,
    onMore,
    selected = false,
  } = props;
  const {
    data: { price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();

  const { data: assetDetails, loading } = useAssetDetailsFromIdCollection(
    data.id,
    data.collectionId
  );
  const { bids, loading: bidsLoading } = useAssetBids(
    data.collectionId,
    EthersBigNumberTo0xBigNumber(data.id),
    assetDetails?.owner
  );

  const allLoaded =
    !bidsLoading &&
    assetDetails &&
    !loading &&
    assetDetails.tokenId.eq(data.id) &&
    assetDetails.collectionId === data.collectionId;
  const responsive = isFullWidth
    ? { xl: 2, lg: 2, md: 4, xs: 6 }
    : { xl: 3, lg: 4, md: 6, xs: 6 };

  const assetDataWithPriceInfo = getAssetObjectWithPrices(
    assetDetails,
    data.orders,
    price,
    networkId || DEFAULT_NETWORK_ID
  );

  const onClickItem = () => {
    if (assetDataWithPriceInfo.asset && onClick) {
      const maxOrder = data.orders.find((order) =>
        xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
      );
      const orders = data.orders.filter(
        (order) =>
          !xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
      );
      onClick({
        ...assetDataWithPriceInfo.asset,
        orders,
        maxOrder,
        bids,
      });
    }
  };

  const onMoreItem = () => {
    if (onMore) {
      onMore((assetDetails || {}).id || "");
    }
  };

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
          onClick={onClickItem}
        >
          {assetDetails && assetDetails.image && (
            <AssetPhoto
              className={classes.img}
              type={assetDetails.imageType}
              uri={assetDetails.image}
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
            {allLoaded ? assetDetails?.name : " "}&nbsp;
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
