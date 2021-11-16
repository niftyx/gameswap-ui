import { Button, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as TickIcon } from "assets/svgs/blue-tick.svg";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { ISwapAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    padding: 12,
    backgroundColor: theme.colors.primary90,
    borderRadius: 4,
  },
  change: {
    color: theme.colors.transparent,
    backgroundColor: theme.colors.transparent,
    fontSize: 12,
    padding: "2px 6px",
    display: "inline-block",
    borderRadius: 4,
    "&.positive": {
      color: theme.colors.lime,
      backgroundColor: transparentize(0.1, theme.colors.primary80),
    },
    "&.negative": {
      color: theme.colors.red40,
      backgroundColor: transparentize(0.1, theme.colors.primary80),
    },
  },
  imgWrapper: { position: "relative", width: "100%", paddingTop: "100%" },
  imgContent: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  img: { width: "100%", height: "100%" },
  headerRow: { display: "flex", alignItems: "center" },
  name: { color: theme.colors.primary40, fontSize: 12 },
  verifyIcon: {
    color: theme.colors.lime,
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  dollar: { color: theme.colors.white, fontSize: 14, margin: "8px 0" },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tokenRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    color: theme.colors.primary60,
    "& img": { width: 14, height: 14, marginRight: 8 },
  },
  bidInfo: { color: theme.colors.primary70, fontSize: 11 },
}));

interface IProps {
  className?: string;
  data: ISwapAssetItem;
  selected: boolean;
}

export const InventoryAssetItem = (props: IProps) => {
  const classes = useStyles();
  const { data, selected } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography
        className={clsx(
          classes.change,
          data.change > 0 && "negative",
          data.change < 0 && "positive"
        )}
      >
        {data.change}%
      </Typography>
      <div className={classes.imgWrapper}>
        <div className={classes.imgContent}>
          <img alt="img" className={classes.img} src={data.img} />
        </div>
      </div>
      <div className={classes.headerRow}>
        <Typography className={classes.name}>{data.name}</Typography>
        {data.verified && <TickIcon className={classes.verifyIcon} />}
      </div>
      <Typography className={classes.dollar}>$ {data.dollar}</Typography>
      <div className={classes.bottomRow}>
        <div className={classes.tokenRow}>
          <img alt="gswap" src="/svgs/tokens/gameswap_icon.svg" />
          {data.price}
        </div>
        <Typography className={classes.bidInfo}>
          #{data.topBidNumber} of {data.totalBids}
        </Typography>
      </div>
    </div>
  );
};
