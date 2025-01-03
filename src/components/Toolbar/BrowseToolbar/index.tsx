import { Box, Hidden, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as CartIcon } from "assets/svgs/cart-arrow-down.svg";
import clsx from "clsx";
import {
  GamesSelect,
  PriceSelect,
  SearchInput,
  SortSelect,
  SyncButton,
  VerticalDivider,
} from "components";
import { useGlobal } from "contexts";
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
  onAuction?: () => void;
  isAuctionActive?: boolean;
}

const BrowseToolbar = (props: IProps) => {
  const classes = useStyles();
  const {
    data: { games },
  } = useGlobal();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuctionActive, onAuction } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      <SyncButton />
      <VerticalDivider />
      {/* <GamesSelect games={games} /> */}
      <Hidden mdDown>
        <SearchInput className={classes.search} />
      </Hidden>
      <Box flex={1} />
      {/* <AuctionsButton active={isAuctionActive} onClick={onAuction} /> */}
      {/* <SortSelect /> */}
      <PriceSelect />
      <VerticalDivider />
      {/* <Typography align="right" className={classes.balance} component="div">
        $ {numberWithCommas("2.00")}
      </Typography>
      <CartIcon className={classes.cart} /> */}
    </div>
  );
};

export default BrowseToolbar;
