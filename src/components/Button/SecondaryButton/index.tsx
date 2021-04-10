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
    borderRadius: 4,
    color: theme.colors.text.default,
    backgroundColor: theme.colors.border.secondary,
    transition: "all 0.4s",
    border: `1px solid ${theme.colors.transparent}`,
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.border.secondary),
    },
    "&.accept-bid": {
      borderColor: theme.colors.text.positive,
      color: theme.colors.text.positive,
    },
  },
}));

interface IProps {
  label: string;
  className?: string;
  onClick: () => void;
}

export const SecondaryButton = (props: IProps) => {
  const classes = useStyles();
  const { label, onClick } = props;
  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      {label}
    </div>
  );
};
