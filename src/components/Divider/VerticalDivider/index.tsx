import { Divider, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: 1,
    backgroundColor: theme.colors.border.third,
  },
}));

interface IProps {
  className?: string;
}

export const VerticalDivider = (props: IProps) => {
  const classes = useStyles();
  return <Divider className={clsx(classes.root, props.className)} />;
};
