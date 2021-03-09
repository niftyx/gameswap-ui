import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
    fontSize: "48px",
    lineHeight: "1.3",
    fontWeight: 600,
    letterSpacing: "-1px",
    color: theme.colors.text.default,
    margin: `${theme.spacing(1.5)}px 0`,
  },
}));

interface IProps {
  className?: string;
  title?: string;
}

export const PageTitle = (props: IProps) => {
  const classes = useStyles();

  return (
    <Typography className={clsx(classes.root, props.className)} component="div">
      {props.title}
    </Typography>
  );
};
