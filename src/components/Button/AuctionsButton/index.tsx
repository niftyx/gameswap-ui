import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as AutionsIcon } from "assets/svgs/gavel.svg";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    cursor: "pointer",
    color: theme.colors.white,
    "& > * + *": {
      marginLeft: theme.spacing(0.5),
    },
    "&.active": {
      color: theme.colors.white,
    },
  },
  label: {
    userSelect: "none",
  },
  icon: {},
}));

interface IProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export const AuctionsButton = (props: IProps) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(
        classes.root,
        props.className,
        props.active ? "active" : ""
      )}
      onClick={props.onClick}
    >
      <Typography className={classes.label} component="div">
        Auctions
      </Typography>
      <AutionsIcon className={classes.icon} />
    </div>
  );
};
