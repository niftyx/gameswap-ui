import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& svg": {
      height: theme.spacing(3),
      width: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
      fullWidth
      onClick={onClick}
      variant="contained"
    >
      {icon}
      {text}
    </Button>
  );
};
