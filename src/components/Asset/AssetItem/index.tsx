import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import { IconAssetPlaceholder, IconCartInCircle } from "assets/icons";
import { ReactComponent as GswapIcon } from "assets/svgs/gameswap_token.svg";
import clsx from "classnames";
import { transparentize } from "polished";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { formatBigNumber, numberWithCommas } from "utils";
import { IAssetItem } from "utils/types";

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
    zIndex: 99,
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
  gswap: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.text.secondary,
  },
  gswapValue: {
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
    zIndex: 1,
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
  data: IAssetItem;
  className?: string;
  isFullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onToggleCart?: () => void;
  isOnCart?: boolean;
}

interface IState {
  loaded: boolean;
}

const AssetItem = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const {
    data,
    isFullWidth = false,
    isOnCart = false,
    onClick,
    onToggleCart,
  } = props;

  const [state, setState] = useState<IState>({ loaded: false });
  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  const respnsive = isFullWidth
    ? { xl: 2, lg: 2, md: 4, xs: 6 }
    : { xl: 3, lg: 4, md: 4, xs: 6 };

  return (
    <Grid
      className={clsx(classes.root, props.className)}
      item
      {...(respnsive as any)}
    >
      <div className={classes.contentContainer}>
        {!state.loaded && (
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
          onClick={onToggleCart}
        >
          {state.loaded && isOnCart && (
            <div className={classes.cartWrapper}>
              <IconCartInCircle />
            </div>
          )}
          <img
            alt="asset_img"
            className={classes.img}
            onLoad={() => setLoaded(true)}
            src={data.image}
          />
          <div className={classes.bottom}>
            <Typography className={classes.usd} component="div">
              ${numberWithCommas(data.usdPrice)}
            </Typography>
            <div className={classes.gswap}>
              <GswapIcon />
              <Typography className={classes.gswapValue} component="div">
                {formatBigNumber(data.gswapPrice, 2)}
              </Typography>
            </div>
          </div>
          <div
            className={clsx(
              classes.percentWrapper,
              data.priceChange < 0 ? "positive" : "negative"
            )}
          >
            {data.priceChange}
          </div>
        </div>
        {state.loaded && (
          <div
            className={clsx(classes.moreWrapper, "asset_item__more_wrapper")}
          >
            <Button
              className={classes.moreButton}
              color="secondary"
              fullWidth
              onClick={onClick as any}
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

export default AssetItem;
