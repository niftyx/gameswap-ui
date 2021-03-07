import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.colors.text.error,
    fontSize: theme.spacing(2),
  },
}));

interface IProps {
  error?: string;
  className?: string;
}

export const ErrorText = (props: IProps) => {
  const classes = useStyles();
  const { error } = props;

  if (!error) return null;

  return (
    <Typography className={clsx(classes.root, props.className)}>
      {error}
    </Typography>
  );
};
