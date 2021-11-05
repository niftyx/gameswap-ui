import { Typography, makeStyles } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: { padding: "32px 24px" },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  category: { fontSize: 16, fontWeight: 600, color: theme.colors.primary60 },
  fav: {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${theme.colors.primary85}`,
    padding: "0 16px",
    borderRadius: 16,
    height: 32,
    color: theme.colors.primary40,
    "& span": {
      color: theme.colors.white,
      fontSize: 12,
    },
    "& svg": {
      width: 16,
      height: 16,
      marginRight: 12,
    },
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    color: theme.colors.white,
  },
}));

interface IProps {
  className?: string;
}

export const MockHeaderSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.top}>
        <Typography className={classes.category}>Inner Circle</Typography>
        <span className={classes.fav}>
          <FavoriteBorderIcon />
          <span>234</span>
        </span>
      </div>
      <Typography className={classes.title}>
        Glock KN-320 - Bubble Gum Winter Edition 2021
      </Typography>
    </div>
  );
};
