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
    color: theme.colors.white,
    backgroundColor: theme.colors.white,
    transition: "all 0.4s",
    border: `1px solid ${theme.colors.transparent}`,
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.white),
    },
    "&.accept-bid": {
      borderColor: theme.colors.white,
      color: theme.colors.white,
    },
    "&.unlock-content": {
      borderColor: theme.colors.primary60,
      color: theme.colors.primary60,
    },
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
  children: React.ReactNode | React.ReactNode[];
}

export const SecondaryButton = (props: IProps) => {
  const classes = useStyles();
  const { children, onClick } = props;
  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      {children}
    </div>
  );
};
