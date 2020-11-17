import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px 0`,
  },
  title: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.colors.background.fourth,
    height: theme.spacing(5),
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

interface IProps {
  className?: string;
}

const TradeFilter = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.title} component="div">
        TRADE
      </Typography>
    </div>
  );
};

export default TradeFilter;
