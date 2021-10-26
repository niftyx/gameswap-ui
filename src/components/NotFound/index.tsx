import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
  },
  text: { color: theme.colors.white },
}));

export const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography align="center" className={classes.text} component="h1">
        404 Not Found
      </Typography>
    </div>
  );
};
