import { Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    paddingTop: "51%",
    backgroundColor: theme.colors.background.sixth,
  },
  content: {
    position: "absolute",
    left: theme.spacing(3),
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    top: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/svgs/backgrounds/grid.svg)",
  },
  img: {
    width: "80%",
    height: "80%",
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
