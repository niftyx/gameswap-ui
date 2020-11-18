import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import { EFarmingTag } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.8, theme.colors.text.default),
    color: transparentize(0.55, theme.colors.text.default),
    padding: "6px 13px 5px",
    display: "inline-block",
    borderRadius: theme.spacing(1.5),
    "&.active": {
      backgroundColor: theme.colors.background.fourth,
      color: theme.colors.text.default,
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
