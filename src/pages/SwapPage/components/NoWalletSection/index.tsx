import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    border: `1px solid ${theme.colors.primary85}`,
    borderRadius: 4,
    padding: 24,
    textAlign: "center",
    paddingTop: 48,
  },
  icon: { width: 24, height: 24, display: "inline-block" },
  note1: { color: theme.colors.primary40, fontSize: 14, marginTop: 24 },
  note2: {
    color: theme.colors.primary70,
    fontSize: 13,
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    height: 32,
    borderRadius: 4,
    backgroundColor: theme.colors.purple60,
  },
}));

interface IProps {
  className?: string;
}

export const NoWalletSection = (props: IProps) => {
  const classes = useStyles();
  const { setWalletConnectModalOpened } = useConnectedWeb3Context();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <img alt="info" className={classes.icon} src="/svgs/icons/info.svg" />
        <Typography align="center" className={classes.note1}>
          Connect your Wallet to start
        </Typography>
        <Typography align="center" className={classes.note2}>
          You need to connect your wallet to load your inventory
        </Typography>
        <Button
          className={classes.button}
          color="primary"
          onClick={() => setWalletConnectModalOpened(true)}
          variant="contained"
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};
