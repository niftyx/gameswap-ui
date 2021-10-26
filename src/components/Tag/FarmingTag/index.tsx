import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.8, theme.colors.white),
    color: transparentize(0.55, theme.colors.white),
    padding: "6px 13px 5px",
    display: "inline-block",
    borderRadius: theme.spacing(1.5),
    "&.active": {
      backgroundColor: theme.colors.primary60,
      color: theme.colors.white,
    },
  },
}));

interface IProps {
  tag: string;
  active?: boolean;
  className?: string;
}

export const FarmingTag = (props: IProps) => {
  const classes = useStyles();
  const { active, className, tag } = props;

  return (
    <span className={clsx(classes.root, className, active ? "active" : "")}>
      {tag}
    </span>
  );
};
