import { Typography, makeStyles } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { ReactComponent as MetaMaskIcon } from "assets/svgs/metamask.svg";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.text.fourth,
    "& > * + *": {
      marginLeft: theme.spacing(0.5),
    },
  },
  error: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    color: theme.colors.text.fourth,
  },
  comment: {
    fontSize: theme.spacing(3),
    lineHeight: `${theme.spacing(4)}px`,
    color: theme.colors.text.default,
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(2),
  },
  detailComment: {
    fontSize: theme.spacing(3),
    lineHeight: `${theme.spacing(4)}px`,
    color: theme.colors.text.fourth,
  },
}));

interface IProps {
  className?: string;
}

const NoWallet = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.row}>
        <ErrorIcon className={classes.error} />
        <MetaMaskIcon />
      </div>
      <Typography className={classes.comment} component="div">
        Connect your wallet to start
      </Typography>
      <Typography
        align="center"
        className={classes.detailComment}
        component="div"
      >
        You need to connect your wallet
        <br />
        to load your inventory
      </Typography>
    </div>
  );
};

export default NoWallet;
