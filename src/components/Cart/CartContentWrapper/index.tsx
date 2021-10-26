import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { numberWithCommas } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    userSelect: "none",
  },
  content: {
    maxHeight: theme.spacing(30),
    overflowY: "auto",
    marginBottom: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
  },
  bottom: {},
  bottomNotice: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
    borderRadius: 6,
    backgroundColor: transparentize(0.9, theme.colors.white),
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsText: {
    color: transparentize(0.5, theme.colors.white),
    fontSize: theme.spacing(1.75),
  },
  totalComment: {
    color: transparentize(0.3, theme.colors.white),
    fontSize: theme.spacing(2),
  },
  totalPrice: {
    color: theme.colors.white,
    fontSize: theme.spacing(2.5),
  },
  tradeButton: {
    height: theme.spacing(5),
    marginTop: theme.spacing(2),
  },
  clearButton: { height: theme.spacing(5), marginTop: theme.spacing(3) },
}));

interface IProps {
  className?: string;
  totalPrice: number;
  itemsCount: number;
  onTrade: () => void;
  onClear: () => void;
  children: React.ReactNode | React.ReactNode[];
}

export const CartContentWrapper = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();
  const isConnected = !!account;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        {props.children}
      </div>
      <div className={classes.bottom}>
        <div className={classes.bottomNotice}>
          <div className={classes.bottomRow}>
            <Typography className={classes.itemsText} component="span">
              Items:
            </Typography>
            <Typography className={classes.itemsText} component="span">
              {props.itemsCount}
            </Typography>
          </div>
          <div className={classes.bottomRow}>
            <Typography className={classes.totalComment} component="span">
              Total:
            </Typography>
            <Typography className={classes.totalPrice} component="span">
              {numberWithCommas(props.totalPrice.toFixed(2))}&nbsp;$
            </Typography>
          </div>
        </div>
        <Button
          className={classes.tradeButton}
          color="secondary"
          disabled={!isConnected}
          fullWidth
          onClick={props.onTrade}
          variant="contained"
        >
          TRADE
        </Button>
        <Button
          className={classes.clearButton}
          color="secondary"
          fullWidth
          onClick={props.onClear}
          variant="outlined"
        >
          CLEAR A CART
        </Button>
      </div>
    </div>
  );
};
