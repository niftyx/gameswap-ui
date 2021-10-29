import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    backgroundColor: theme.colors.primary80,
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.primary80),
    },
    "& svg": {
      height: theme.spacing(6),
      width: theme.spacing(6),
      marginBottom: theme.spacing(1),
    },
  },
  label: {
    margin: "16px 0",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    color: transparentize(0.2, theme.colors.white),
    fontSize: 12,
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  text: string;
  icon: React.ReactNode;
}

export const ConnectWalletButton = (props: IProps) => {
  const classes = useStyles();
  const { disabled = false, icon, onClick, text } = props;
  return (
    <Button
      className={clsx(classes.root, props.className)}
      classes={{ label: classes.label }}
      disabled={disabled}
      onClick={onClick}
      variant="contained"
    >
      {icon}
      {text}
    </Button>
  );
};
