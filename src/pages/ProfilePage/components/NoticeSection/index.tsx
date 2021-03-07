import { Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  comment: {
    fontSize: theme.spacing(1.6125),
    marginTop: theme.spacing(2),
    color: transparentize(0.4, theme.colors.text.default),
  },
  value: {
    fontSize: theme.spacing(6),
    color: theme.colors.text.default,
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  transactions: number;
  itemsInMarket: number;
  bids: number;
  auctionsWon: number;
}

export const NoticeSection = (props: IProps) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState<IState>({
    transactions: 178,
    itemsInMarket: 23,
    bids: 32,
    auctionsWon: 19,
  });

  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={6} xs={6}>
          <Typography className={classes.value} component="div">
            {state.transactions}
          </Typography>
          <Typography className={classes.comment} component="div">
            TRANSACTIONS
          </Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <Typography className={classes.value} component="div">
            {state.itemsInMarket}
          </Typography>
          <Typography className={classes.comment} component="div">
            ITEMS IN MARKET
          </Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <Typography className={classes.value} component="div">
            {state.bids}
          </Typography>
          <Typography className={classes.comment} component="div">
            BIDS
          </Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={6}>
          <Typography className={classes.value} component="div">
            {state.auctionsWon}
          </Typography>
          <Typography className={classes.comment} component="div">
            AUCTIONS WON
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
