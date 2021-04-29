import { Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder } from "assets/icons";
import { ReactComponent as HeartIcon } from "assets/svgs/heart.svg";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useAssetDetailsFromIdCollection, useAssetOrders } from "helpers";
import React from "react";
import useCommonStyles from "styles/common";
import { formatBigNumber } from "utils";
import { getHighestBid, getLowestAsk } from "utils/bid";
import { MAX_NUMBER } from "utils/number";
import {
  EthersBigNumberTo0xBigNumber,
  xBigNumberToEthersBigNumber,
} from "utils/token";
import { ITradeAssetItem } from "utils/types";

import { AssetPhoto } from "../AssetPhoto";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    cursor: "pointer",
    position: "relative",
    userSelect: "none",
    padding: 8,
    backgroundColor: theme.colors.background.eleventh,
    borderRadius: 4,
    overflow: "hidden",
    transition: "all 0.4s",
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  topBid: { color: theme.colors.text.secondary, fontSize: 13 },
  price: { color: theme.colors.text.default },
  count: { color: theme.colors.text.secondary },
}));

interface IProps {
  data: ITradeAssetItem;
  className?: string;
  onClick?: (_: string) => void;
  onMore?: (_: string) => void;
  isOnCart?: boolean;
}

export const BrowseAssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { data, onClick = () => {}, onMore } = props;
  const {
    data: { price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();

  const { data: assetDetails, loading } = useAssetDetailsFromIdCollection(
    data.id,
    data.collectionId
  );
  const { bids, loading: bidsLoading } = useAssetOrders(
    data.collectionId,
    EthersBigNumberTo0xBigNumber(data.id)
  );

  const { orders: asks } = data;

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

  const allLoaded =
    !bidsLoading &&
    assetDetails &&
    !loading &&
    assetDetails.tokenId.eq(data.id) &&
    assetDetails.collectionId === data.collectionId;
  const responsive = { xl: 2, lg: 2, md: 3, xs: 6, sm: 4 };

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
      <div
        className={classes.content}
        onClick={() => {
          if (allLoaded) onClick((assetDetails || {}).id || "");
        }}
      >
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
