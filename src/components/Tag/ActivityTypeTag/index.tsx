import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import { EActivityType } from "utils/enums";

const useStyles = (type: EActivityType) =>
  makeStyles((theme) => ({
    root: {
      padding: "6px 13px 5px",
      display: "inline-block",
      borderRadius: theme.spacing(1.5),
      color: theme.colors.activity.text[type],
      backgroundColor: theme.colors.activity.bg[type],
      minWidth: theme.spacing(7.5),
      textAlign: "center",
      textTransform: "uppercase",
    },
  }));

interface IProps {
  type: EActivityType;
  className?: string;
}

export const ActivityTypeTag = (props: IProps) => {
  const { className, type } = props;
  const classes = useStyles(type)();
  return <span className={clsx(classes.root, className)}>{type}</span>;
};
