import { Grid, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles(() => ({
  root: {},
}));

interface IProps {
  className?: string;
  children?: React.ReactNode;
}

const AssetsContainer = (props: IProps) => {
  const classes = useStyles();
  return (
    <Grid className={clsx(classes.root, props.className)} container spacing={1}>
      {props.children}
    </Grid>
  );
};

export default AssetsContainer;
