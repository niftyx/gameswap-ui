import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { AuctionsButton, SyncButton } from "components/Button";
import { VerticalDivider } from "components/Divider";
import { GamesSelect, PriceSelect, SortSelect } from "components/Select";
import React from "react";

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

const TrendingToolbar = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <SyncButton />
      <VerticalDivider />
      <GamesSelect />
      <Box flex="1" />
      {/* <AuctionsButton /> */}
      <SortSelect />
      <PriceSelect />
    </div>
  );
};

export default TrendingToolbar;
