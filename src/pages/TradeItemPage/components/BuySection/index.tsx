import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { formatBigNumber, shortenAddress } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    zIndex: 10,
    bottom: 0,
    backgroundColor: transparentize(0.8, theme.colors.text.secondary),
    backdropFilter: "blur(20px)",
    boxShadow: "rgb(18 18 18 / 90%) 0px -14px 40px",
  },
  content: {
    padding: "24px 32px",
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
  buyNow: {
    height: theme.spacing(6),
    flex: 1,
    fontSize: theme.spacing(2.5),
    [theme.breakpoints.down("xs")]: {
      minWidth: theme.spacing(25),
      height: theme.spacing(6),
    },
  },
  bid: {
    height: theme.spacing(6),
    flex: 1,
    fontSize: theme.spacing(2.5),
    backgroundColor: transparentize(0.4, theme.colors.text.secondary),
    [theme.breakpoints.down("xs")]: {
      minWidth: theme.spacing(25),
      height: theme.spacing(6),
    },
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
  onBuy: () => void;
}

export const BuySection = (props: IProps) => {
  const classes = useStyles();

  const { networkId } = useConnectedWeb3Context();
  const { data, onBuy } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div className={classes.buttonRow}>
          <Button
            className={classes.buyNow}
            color="primary"
            onClick={onBuy}
            variant="contained"
          >
            Buy now
          </Button>
          <Button className={classes.bid} color="secondary" variant="contained">
            Bid
          </Button>
        </div>
      </div>
    </div>
  );
};
