import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export const UsersSection = () => {
  const classes = useStyles();
  return <div className={classes.root}>Test</div>;
};
