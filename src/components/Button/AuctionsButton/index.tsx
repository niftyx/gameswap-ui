import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as AutionsIcon } from "assets/svgs/gavel.svg";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    cursor: "pointer",
    color: theme.colors.text.third,
    "& > * + *": {
      marginLeft: theme.spacing(0.5),
    },
  },
  label: {},
  icon: {},
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

export const AuctionsButton = (props: IProps) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.root, props.className)}
      onClick={props.onClick}
    >
      <Typography className={classes.label} component="div">
        Autions
      </Typography>
      <AutionsIcon className={classes.icon} />
    </div>
  );
};
