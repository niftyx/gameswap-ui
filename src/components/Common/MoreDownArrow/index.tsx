import { makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "center", margin: "16px 0" },
  content: {
    display: "inline-flex",
    flexDirection: "column",
    position: "relative",
    animation: "move-up-down 2s infinite",
  },
  icon: {
    color: theme.colors.primary60,
    "&:first-child": {
      color: theme.colors.primary40,
    },
    "&:last-child": {
      color: theme.colors.primary70,
    },
    "&+&": {
      marginTop: -12,
    },
  },
}));

interface IProps {
  className?: string;
}

export const MoreDownArrow = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <ExpandMoreIcon className={classes.icon} />
        <ExpandMoreIcon className={classes.icon} />
        <ExpandMoreIcon className={classes.icon} />
      </div>
    </div>
  );
};
