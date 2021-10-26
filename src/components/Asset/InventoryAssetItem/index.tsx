import { Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder } from "assets/icons";
import { ReactComponent as HeartIcon } from "assets/svgs/heart.svg";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useAssetDetailsFromInventoryItem, useAssetOrders } from "helpers";
import React from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";
import { formatBigNumber } from "utils";
import { getHighestBid, getLowestAsk } from "utils/bid";
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
    cursor: "pointer",
    position: "relative",
    userSelect: "none",
    padding: 8,
    backgroundColor: theme.colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
    transition: "all 0.4s",
    border: `2px solid ${theme.colors.transparent}`,
    "&.selected": {
      borderColor: theme.colors.primary60,
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
      backgroundColor: theme.colors.primary90,
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
    backgroundColor: theme.colors.primary80,
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
    backgroundColor: theme.colors.primary70,
    borderRadius: "50%",
    zIndex: 3,
    "& svg": {
      color: theme.colors.white,
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
    color: theme.colors.white,
    marginTop: 8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  topBid: { color: theme.colors.white, fontSize: 13 },
  price: { color: theme.colors.white },
  count: { color: theme.colors.white },
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
    EthersBigNumberTo0xBigNumber(data.assetId)
  );
  const {
    data: { price },
  } = useGlobal();
  const { account, networkId } = useConnectedWeb3Context();

  const maxOrder = asks.find((order) =>
    xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
  );
  const orders = asks.filter(
    (order) =>
      !xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
  );
  const highestBid = getHighestBid(
    bids,
    price,
    networkId || DEFAULT_NETWORK_ID
  );
  const highestBidToken = highestBid
    ? getTokenFromAddress(
        networkId || DEFAULT_NETWORK_ID,
        highestBid.erc20Address
      )
    : null;
  const highestAsk = getLowestAsk(
    orders,
    price,
    networkId || DEFAULT_NETWORK_ID
  );
  const highestAskToken = highestAsk
    ? getTokenFromAddress(
        networkId || DEFAULT_NETWORK_ID,
        highestAsk.erc20Address
      )
    : null;

  const isInSale = !!maxOrder || orders.length > 0;

  const responsive = isFullWidth
    ? { xl: 2, lg: 2, md: 3, xs: 6, sm: 4 }
    : { xl: 3, lg: 4, md: 6, xs: 6, sm: 6 };

  const onClickDetails = () => {
    if (asset && onClick) {
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
            <Typography className={classes.price}>
              {isInSale
                ? highestAsk && highestAskToken
                  ? `${Number(
                      formatBigNumber(
                        xBigNumberToEthersBigNumber(
                          highestAsk.takerAssetAmount
                        ),
                        highestAskToken.decimals
                      )
                    )} ${highestAskToken.symbol}`
                  : "In Sale"
                : "Not In Sale"}
            </Typography>
            <Typography className={classes.count}>1 of 1</Typography>
          </div>
          <Typography className={classes.topBid}>
            {highestBid && highestBidToken
              ? `Bid ${Number(
                  formatBigNumber(
                    xBigNumberToEthersBigNumber(highestBid.makerAssetAmount),
                    highestBidToken.decimals
                  )
                )} ${highestBidToken.symbol}`
              : "No Bid"}
          </Typography>
        </div>
      </div>
    </Grid>
  );
};
