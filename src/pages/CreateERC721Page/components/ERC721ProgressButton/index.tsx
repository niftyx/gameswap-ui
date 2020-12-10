import { Button, Typography, makeStyles } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
  icon: {
    fontSize: theme.spacing(4),
    color: theme.colors.text.default,
    "&.approved": {},
  },
  title: {},
  description: {},
  error: {},
}));

interface IProps {
  approved: boolean;
  title: string;
  description: string;
  buttonTitle: string;
  buttonDisabled: boolean;
  buttonLoadingText: string;
  isLoading: boolean;
  errorText: string;
  onClick: () => void;
}

export const ERC721ProgressButton = (props: IProps) => {
  const classes = useStyles();
  const {
    approved,
    buttonDisabled,
    buttonLoadingText,
    buttonTitle,
    description,
    errorText,
    isLoading,
    onClick,
    title,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <DoneIcon />
      </div>
    </div>
  );
};
