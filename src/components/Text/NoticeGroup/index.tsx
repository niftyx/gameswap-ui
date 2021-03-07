import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "16px 0",
  },
  comment: {
    fontSize: 16,
    lineHeight: 1.5,
    color: transparentize(0.5, theme.colors.text.default),
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    lineHeight: 1.5,
    color: transparentize(0.1, theme.colors.text.default),
  },
}));

interface IProps {
  className?: string;
  comment: string;
  title: string;
}

export const NoticeGroup = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.comment} component="div">
        {props.comment}
      </Typography>
      <Typography className={classes.title} component="div">
        {props.title}
      </Typography>
    </div>
  );
};
