import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.background.eighth,
    color: theme.colors.text.default,
    padding: "6px 15px 5px",
    fontSize: 10,
    display: "inline-block",
    borderRadius: theme.spacing(1.5),
    textTransform: "uppercase",
  },
}));

interface IProps {
  tag: string;
  className?: string;
}

export const BidTag = (props: IProps) => {
  const classes = useStyles();
  const { className, tag } = props;

  return <span className={clsx(classes.root, className)}>{tag}</span>;
};
