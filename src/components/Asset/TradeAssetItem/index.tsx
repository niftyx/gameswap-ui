import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder } from "assets/icons";
import clsx from "classnames";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useAssetDetailsFromId } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { getAssetObjectWithPrices, getObjectIdFromHex } from "utils/tools";
import { IAssetItem, ITradeAssetItem } from "utils/types";

import { AssetPhoto } from "../AssetPhoto";

const useStyles = makeStyles((theme) => ({
  root: {},
  contentContainer: {
    width: "100%",
    paddingTop: "95%",
    position: "relative",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      "& .asset_item__content": {
        background: `linear-gradient(149.66deg,${transparentize(
          0.8,
          theme.colors.text.default
        )} 2.97%,${transparentize(0.75, theme.colors.text.default)} 92.61%)`,
      },
      "& .asset_item__more_wrapper": {
        opacity: 1,
        transform: "translateZ(0)",
        transition: "transform 0.25s ease",
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
  content: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    backgroundColor: theme.colors.background.sixth,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    willChange: "background",
  },
  cartWrapper: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    height: "80%",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usd: {
    color: theme.colors.text.default,
    fontSize: 17,
    lineHeight: "23px",
  },
  token: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.text.default,
  },
  tokenAmount: {
    fontSize: 15,
    lineHeight: "20px",
  },
  percentWrapper: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    padding: "2px 6px",
    "&.positive": {
      backgroundColor: transparentize(0.73, theme.colors.text.positive),
      color: theme.colors.text.positive,
    },
    "&.negative": {
      backgroundColor: transparentize(0.73, theme.colors.text.negative),
      color: theme.colors.text.negative,
    },
  },
  moreWrapper: {
    opacity: 0,
    position: "absolute",
    zIndex: 11,
    outlineOffset: -1,
    width: "100%",
    transform: "translate3d(0, -110%, 0)",
  },
  moreButton: {
    height: theme.spacing(5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
}));

interface IProps {
  data: ITradeAssetItem;
  className?: string;
  isFullWidth?: boolean;
  onClick?: (_: IAssetItem) => void;
  onMore?: () => void;
  isOnCart?: boolean;
}

interface IState {
  loaded: boolean;
}

const TradeAssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const {
    data,
    isFullWidth = false,
    // isOnCart = false,
    onClick,
    onMore,
  } = props;
  const {
    data: { price },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();

  const objectId = getObjectIdFromHex(data.id);
  const { data: assetDetails, loading } = useAssetDetailsFromId(objectId);

  const [state, setState] = useState<IState>({ loaded: false });
  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  const assetDataLoaded =
    assetDetails && !loading && assetDetails.id === objectId;

  const responsive = isFullWidth
    ? { xl: 2, lg: 2, md: 4, xs: 6 }
    : { xl: 3, lg: 4, md: 6, xs: 6 };

  const assetDataWithPriceInfo = getAssetObjectWithPrices(
    assetDetails,
    data.orders,
    price,
    networkId || 1
  );

  return (
    <Grid
      className={clsx(classes.root, props.className)}
      item
      {...(responsive as any)}
    >
      <div className={classes.contentContainer}>
        {(!assetDataLoaded || !state.loaded) && (
          <div className={classes.placeholder}>
            <IconAssetPlaceholder />
          </div>
        )}
        <div
          className={clsx(
            classes.content,
            "asset_item__content",
            commonClasses.fadeAnimation,
            state.loaded ? "visible" : ""
          )}
          onClick={() => {
            if (assetDataWithPriceInfo.asset && onClick) {
              onClick({ ...assetDataWithPriceInfo.asset, orders: data.orders });
            }
          }}
        >
          {/* {state.loaded && isOnCart && (
            <div className={classes.cartWrapper}>
              <IconCartInCircle />
            </div>
          )}
           */}
          {assetDataLoaded && assetDetails && (
            <>
              <AssetPhoto
                className={classes.img}
                onLoad={() => setLoaded(true)}
                type={assetDetails.imageType}
                uri={assetDetails.image}
              />
              <div className={classes.bottom}>
                <Typography className={classes.usd} component="div">
                  ${assetDataWithPriceInfo.minUSDPrice}
                </Typography>
                {assetDataWithPriceInfo.asset && (
                  <div className={classes.token}>
                    <Typography className={classes.tokenAmount} component="div">
                      {assetDataWithPriceInfo.minTokenAmountString}
                    </Typography>
                  </div>
                )}
              </div>
              {/* <div
                className={clsx(
                  classes.percentWrapper,
                  assetDetails.priceChange < 0 ? "positive" : "negative"
                )}
              >
                {assetDetails.priceChange}
              </div> */}
            </>
          )}
        </div>
        {state.loaded && (
          <div
            className={clsx(classes.moreWrapper, "asset_item__more_wrapper")}
          >
            <Button
              className={classes.moreButton}
              color="secondary"
              fullWidth
              onClick={onMore as any}
              variant="contained"
            >
              More Info
            </Button>
          </div>
        )}
      </div>
    </Grid>
  );
};

export default TradeAssetItem;
