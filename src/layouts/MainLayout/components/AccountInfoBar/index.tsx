import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import { shortenAddress } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(1.5),
    },
  },
  gswap: {
    padding: `0 10.5px`,
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.background.third,
    height: theme.custom.appHeaderItemHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: theme.spacing(1.25),
    lineHeight: `${theme.spacing(1.75)}px`,
    color: transparentize(0.63, theme.colors.text.default),
  },
  gswapValue: {
    fontSize: theme.spacing(2.5),
    lineHeight: `${theme.spacing(3.375)}px`,
    color: theme.colors.text.default,
  },
  eth: {
    padding: 3,
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.background.secondary,
    height: theme.custom.appHeaderItemHeight,
    display: "flex",
    alignItems: "center",
  },
  ethValue: {
    fontSize: theme.spacing(2.5),
    lineHeight: `${theme.spacing(3.375)}px`,
    color: transparentize(0.18, theme.colors.text.default),
  },
}));

interface IProps {
  className?: string;
}

const AccountInfoBar = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.gswap}>
        <Typography className={classes.label} component="div">
          GSWAP
        </Typography>
        <Typography className={classes.gswapValue} component="div">
          240.60
        </Typography>
      </div>
      <div className={classes.eth}>
        <Typography component="div">
          {shortenAddress("0x18B13ef88822292E59bfF80210D815F7FBFC9b32")}
        </Typography>
      </div>
    </div>
  );
};

export default AccountInfoBar;
