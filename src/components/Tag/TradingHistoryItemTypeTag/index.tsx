import { Typography, makeStyles } from "@material-ui/core";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
// import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import clsx from "classnames";
import React from "react";
import { EHistoryItemType } from "utils/enums";

const icons = {
  [EHistoryItemType.Created]: NewReleasesIcon,
  [EHistoryItemType.List]: LocalOfferIcon,
  [EHistoryItemType.Sale]: ShoppingCartIcon,
  // [EHistoryItemType.Transfer]: SwapHorizIcon,
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  icon: {},
  title: { marginLeft: 16 },
}));

interface IProps {
  type: EHistoryItemType;
  className?: string;
}

export const TradingHistoryItemTypeTag = (props: IProps) => {
  const { className, type } = props;
  const classes = useStyles();
  const Icon = icons[type];
  return (
    <div className={clsx(classes.root, className)}>
      <Icon className={classes.icon} />
      <Typography className={classes.title}>
        {EHistoryItemType[type]}
      </Typography>
    </div>
  );
};
