import { Box, Hidden, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as CartIcon } from "assets/svgs/cart-arrow-down.svg";
import clsx from "classnames";
import {
  AuctionsButton,
  GamesSelect,
  PriceSelect,
  SearchInput,
  SortSelect,
  SyncButton,
  VerticalDivider,
} from "components";
import React from "react";
import { numberWithCommas } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.pageToolbarHeight,
    padding: `${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2.5),
    },
  },
  balance: {
    color: theme.colors.text.third,
  },
  cart: {
    cursor: "pointer",
    color: theme.colors.text.third,
  },
  search: {
    flex: 3,
  },
}));

interface IProps {
  className?: string;
}

const BrowseToolbar = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <SyncButton />
      <VerticalDivider />
      <GamesSelect />
      <Hidden mdDown>
        <SearchInput className={classes.search} />
      </Hidden>
      <Box flex={1} />
      <AuctionsButton />
      <SortSelect />
      <PriceSelect />
      <VerticalDivider />
      <Typography align="right" className={classes.balance} component="div">
        $ {numberWithCommas("2.00")}
      </Typography>
      <CartIcon className={classes.cart} />
    </div>
  );
};

export default BrowseToolbar;
