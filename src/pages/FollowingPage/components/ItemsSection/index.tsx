import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export const ItemsSection = () => {
  const classes = useStyles();
  return <div className={classes.root}>ItemsSection</div>;
};
