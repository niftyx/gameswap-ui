import { Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.border.secondary,
  },
}));

interface IProps {
  className?: string;
}

export const HorizonDivider = (props: IProps) => {
  const classes = useStyles();
  return <Divider className={clsx(classes.root, props.className)} />;
};
