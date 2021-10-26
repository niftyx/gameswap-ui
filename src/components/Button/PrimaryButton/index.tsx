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
    color: theme.colors.white,
    borderRadius: 4,
    backgroundColor: theme.colors.primary60,
    transition: "all 0.4s",
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.primary60),
    },
  },
}));

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onClick: () => void;
}

export const PrimaryButton = (props: IProps) => {
  const classes = useStyles();
  const { children, onClick } = props;
  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      {children}
    </div>
  );
};
