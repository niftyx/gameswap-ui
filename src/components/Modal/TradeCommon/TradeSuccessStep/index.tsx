import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  title: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: theme.spacing(2.5),
  },
  redirect: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: theme.spacing(3),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
}));

interface IProps {
  title: string;
}

export const TradeSuccessStep = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography className={classes.title}>{props.title}</Typography>
        <Typography className={classes.redirect}>Redirecting...</Typography>
      </div>
    </div>
  );
};
