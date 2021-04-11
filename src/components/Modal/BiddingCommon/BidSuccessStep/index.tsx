import { Typography, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { waitSeconds } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  title: {
    textAlign: "center",
    color: theme.colors.text.default,
    fontSize: theme.spacing(2.5),
  },
  redirect: {
    textAlign: "center",
    color: theme.colors.text.default,
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
  onClose: () => void;
}

export const BidSuccessStep = (props: IProps) => {
  const classes = useStyles();
  useEffect(() => {
    const wait = async () => {
      await waitSeconds(2);
      props.onClose();
    };
    wait();
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography className={classes.title}>{props.title}</Typography>
        <Typography className={classes.redirect}>Loading...</Typography>
      </div>
    </div>
  );
};
