import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 55,
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.text.default,
    borderRadius: 4,
    backgroundColor: theme.colors.background.fourth,
    transition: "all 0.4s",
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.background.fourth),
    },
  },
}));

interface IProps {
  label: string;
  className?: string;
  onClick: () => void;
}

export const PrimaryButton = (props: IProps) => {
  const classes = useStyles();
  const { label, onClick } = props;
  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      {label}
    </div>
  );
};
