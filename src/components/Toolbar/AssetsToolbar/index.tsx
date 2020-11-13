import { Hidden, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as CartIcon } from "assets/svgs/cart-arrow-up.svg";
import clsx from "classnames";
import { SyncButton } from "components/Button";
import { VerticalDivider } from "components/Divider";
import { SearchInput } from "components/Input";
import { GamesSelect, SortSelect } from "components/Select";
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
    flex: 1,
    color: theme.colors.text.third,
  },
  cart: {
    cursor: "pointer",
  },
}));

interface IProps {
  className?: string;
}

const AssetsToolbar = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <CartIcon className={classes.cart} />
      <Typography align="left" className={classes.balance} component="div">
        $ {numberWithCommas("2.00")}
      </Typography>
      <Hidden lgDown>
        <SearchInput />
      </Hidden>
      <GamesSelect />
      <SortSelect />
      <VerticalDivider />
      <SyncButton />
    </div>
  );
};

export default AssetsToolbar;
