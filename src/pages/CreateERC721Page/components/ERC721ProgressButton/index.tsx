import {
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
  },
  icon: {
    fontSize: theme.spacing(6),
    marginRight: theme.spacing(2),
    color: transparentize(0.7, theme.colors.text.default),
    transition: "all 0.5s",
    "&.approved": {
      color: theme.colors.text.default,
    },
  },
  progressWrapper: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2.5),
    fontWeight: "bold",
  },
  description: {
    color: transparentize(0.3, theme.colors.text.default),
    fontSize: theme.spacing(2),
  },
  error: {
    color: theme.colors.text.error,
    fontSize: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    height: theme.spacing(6),
    borderRadius: theme.spacing(3),
  },
}));

interface IProps {
  approved: boolean;
  title: string;
  description: string;
  buttonTitle: string;
  buttonDisabled: boolean;
  buttonLoadingText: string;
  isLoading: boolean;
  errorText?: string;
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
        {isLoading ? (
          <div className={classes.progressWrapper}>
            <CircularProgress size={48} />
          </div>
        ) : (
          <DoneIcon
            className={clsx(classes.icon, approved ? "approved" : "")}
          />
        )}
        <div>
          <Typography className={classes.title}>{title}</Typography>
          <Typography className={classes.description}>{description}</Typography>
        </div>
      </div>
      {errorText && (
        <Typography className={classes.error}>{errorText}</Typography>
      )}
      <Button
        className={classes.button}
        color="primary"
        disabled={buttonDisabled}
        fullWidth
        onClick={isLoading ? () => {} : onClick}
        variant="contained"
      >
        {isLoading ? buttonLoadingText : buttonTitle}
      </Button>
    </div>
  );
};
