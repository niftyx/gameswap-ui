import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { numberWithCommas } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    minHeight: theme.spacing(30),
    maxHeight: theme.spacing(40),
  },
  bottom: {},
  bottomNotice: {},
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsText: {},
  totalComment: {},
  totalPrice: {},
  tradeButton: {},
  clearButton: {},
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
          fullWidth
          variant="contained"
        >
          TRADE
        </Button>
        <Button
          className={classes.clearButton}
          color="secondary"
          fullWidth
          variant="outlined"
        >
          CLEAR A CART
        </Button>
      </div>
    </div>
  );
};
