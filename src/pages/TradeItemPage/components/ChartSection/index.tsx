import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

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

export const ChartSection = (props: IProps) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, props.className)}>Chart</div>;
};
