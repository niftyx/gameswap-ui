import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder } from "assets/icons";
import clsx from "classnames";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import { useAssetDetailsFromInventoryItem } from "helpers";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";
import { getLogger } from "utils/logger";
import { getAssetObjectWithPrices } from "utils/tools";
import { IAssetItem } from "utils/types";

// eslint-disable-next-line
const logger = getLogger("InventoryAssetItem::");

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
  img: {
    height: "80%",
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
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  data: IGraphInventoryAsset;
  className?: string;
  isFullWidth?: boolean;
  onClick?: (_: IAssetItem) => void;
  onMore?: () => void;
}

const BrowseAssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { openBuyModal } = useTrade();

  const { data, isFullWidth = false, onMore } = props;
  const {
    data: { price },
  } = useGlobal();
  const { account, networkId } = useConnectedWeb3Context();
  const { asset, loaded } = useAssetDetailsFromInventoryItem(data);

  const responsive = isFullWidth
    ? { xl: 2, lg: 2, md: 4, xs: 6 }
    : { xl: 3, lg: 4, md: 6, xs: 6 };

  const assetDataWithPriceInfo = getAssetObjectWithPrices(
    asset,
    data.orders || [],
    price,
    networkId || 1
  );

  const isInSale = (data.orders || []).length > 0;

  return (
    <Grid
      className={clsx(classes.root, props.className)}
      item
      {...(responsive as any)}
    >
      <div className={classes.contentContainer}>
        {!loaded && (
          <div className={classes.placeholder}>
            <IconAssetPlaceholder />
          </div>
        )}
        <div
          className={clsx(
            classes.content,
            "asset_item__content",
            commonClasses.fadeAnimation,
            loaded ? "visible" : ""
          )}
          onClick={() => {
            if (asset) {
              if (
                isInSale &&
                asset.owner !== account &&
                assetDataWithPriceInfo.asset
              ) {
                openBuyModal({
                  ...assetDataWithPriceInfo.asset,
                  orders: data.orders,
                });
              }
            }
          }}
        >
          {asset && asset.image && (
            <img alt="asset_img" className={classes.img} src={asset.image} />
          )}
          {isInSale && (
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
          )}
        </div>
        {loaded && (
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

export default BrowseAssetItem;
