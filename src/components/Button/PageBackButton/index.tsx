import { Typography, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1.5)}px 0`,
    display: "flex",
    alignItems: "center",
    fontSize: theme.spacing(2.5),
    color: theme.colors.white,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.4s",
    "& > * + *": {
      marginLeft: theme.spacing(1.25),
    },
    "&:hover": {
      color: transparentize(0.2, theme.colors.white),
    },
  },
}));

interface IProps {
  onBack?: () => void;
  title: string;
  className?: string;
}

export const PageBackButton = (props: IProps) => {
  const classes = useStyles();

  const { onBack, title } = props;

  return (
    <div className={clsx(classes.root, props.className)} onClick={onBack}>
      <ArrowBackIcon />
      <Typography component="span">{title}</Typography>
    </div>
  );
};
