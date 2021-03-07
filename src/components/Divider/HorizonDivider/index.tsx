import { Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.8, theme.colors.text.default),
  },
}));

interface IProps {
  className?: string;
}

export const HorizonDivider = (props: IProps) => {
  const classes = useStyles();
  return <Divider className={clsx(classes.root, props.className)} />;
};
