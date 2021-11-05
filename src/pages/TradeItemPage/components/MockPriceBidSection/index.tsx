import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import Identicon from "react-identicons";
const IdenticonComponent = Identicon as any;

const useStyles = makeStyles((theme) => ({
  root: { padding: 24 },
  dollar: { fontSize: 36, color: theme.colors.white, fontWeight: 600 },
  tokenRow: {
    margin: "6px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tokenWrapper: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.primary60,
    "& img": {
      width: 24,
      height: 24,
      marginRight: 10,
    },
  },
  feeWrapper: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.primary70,
    "& img": {
      width: 16,
      height: 16,
    },
  },
  buttons: { display: "flex", alignItems: "center", marginTop: 32 },
  button: {
    flex: 1,
    height: 48,
    backgroundColor: theme.colors.primary85,
    "&.active": { backgroundColor: theme.colors.purple60 },
    "&+&": { marginLeft: 16 },
  },
  bidder: {
    marginTop: 24,
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${theme.colors.primary85}`,
    paddingBottom: 24,
  },
  bidderAvatar: {
    borderRadius: "50%",
    overflow: "hidden",
    minWidth: 32,
    width: 32,
    height: 32,
  },
  bidderText: {
    flex: 1,
    marginLeft: 24,
    marginRight: 16,
    fontSize: 14,
    color: theme.colors.primary70,
    "& span": { color: theme.colors.primary40 },
  },
  bidPriceWrapper: {},
  bidDollar: { fontSize: 18, color: theme.colors.white },
  bidToken: { color: theme.colors.primary70, fontSize: 13 },
}));

interface IProps {
  className?: string;
}

export const MockPriceBidSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.dollar}>$ 26,450.00</Typography>
      <div className={classes.tokenRow}>
        <Typography className={classes.tokenWrapper}>
          <img alt="gswpa" src="/svgs/tokens/gameswap_icon.svg" />
          22,791.90
        </Typography>
        <Typography className={classes.feeWrapper}>
          Service fee: 5% &nbsp;
          <img alt="gswpa" src="/svgs/icons/info.svg" />
        </Typography>
      </div>
      <div className={classes.buttons}>
        <Button
          className={clsx(classes.button, "active")}
          color="primary"
          variant="contained"
        >
          Buy Now
        </Button>
        <Button
          className={classes.button}
          color="secondary"
          variant="contained"
        >
          Bid
        </Button>
        <Button
          className={classes.button}
          color="secondary"
          variant="contained"
        >
          Swap
        </Button>
      </div>
      <div className={classes.bidder}>
        <div className={classes.bidderAvatar}>
          <IdenticonComponent bg="#fff" size={32} string="bidder" />
        </div>

        <Typography className={classes.bidderText}>
          Highest bid by <span>0x1eeb...30d5</span>
        </Typography>
        <div className={classes.bidPriceWrapper}>
          <Typography align="right" className={classes.bidDollar}>
            $75,000
          </Typography>
          <Typography align="right" className={classes.bidToken}>
            5000 GSWAP
          </Typography>
        </div>
      </div>
    </div>
  );
};
