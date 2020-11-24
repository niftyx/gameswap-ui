import { Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    paddingTop: "50%",
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.sixth,
  },
  img: {
    width: "70%",
    height: "70%",
  },
}));

interface IProps {
  className?: string;
  img?: string;
}

export const ItemViewSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <img alt="img" className={classes.img} src={props.img} />
      </div>
    </div>
  );
};
