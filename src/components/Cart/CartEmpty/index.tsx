import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    minHeight: theme.spacing(30),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: theme.spacing(2.5),
    color: theme.colors.white,
  },
  comment: {
    textAlign: "center",
    fontSize: theme.spacing(2),
    color: transparentize(0.4, theme.colors.white),
  },
}));

interface IProps {
  className?: string;
}

export const CartEmpty = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.title}>Your cart is empty</Typography>
      <Typography className={classes.comment} component="div">
        Add items you want to trade from our inventory
      </Typography>
    </div>
  );
};
