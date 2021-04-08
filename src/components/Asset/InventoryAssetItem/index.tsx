import { Button, Grid, makeStyles } from "@material-ui/core";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { IconAssetPlaceholder } from "assets/icons";
import clsx from "clsx";
import { useAssetDetailsFromInventoryItem, useAssetOrders } from "helpers";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";
import { getLogger } from "utils/logger";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { IAssetItem } from "utils/types";

import { AssetPhoto } from "../AssetPhoto";

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
  inSaleIcon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: transparentize(0.2, theme.colors.text.default),
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

export const InventoryAssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { data, isFullWidth = false, onClick, onMore } = props;

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
    if (asset && onClick) onClick(asset);
  };

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
          onClick={onClickDetails}
        >
          {asset && asset.image && (
            <AssetPhoto
              className={classes.img}
              type={asset.imageType}
              uri={asset.image}
            />
          )}
          {asset && data.isInSale && (
            <AttachMoneyIcon className={classes.inSaleIcon} />
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
