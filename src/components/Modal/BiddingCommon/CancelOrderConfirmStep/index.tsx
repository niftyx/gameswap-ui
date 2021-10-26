import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  description: {
    color: theme.colors.white,
    fontSize: 14,
    lineHeight: "24px",
    marginBottom: 24,
    "& span": {
      color: theme.colors.white,
      fontSize: 16,
    },
  },

  place: {
    height: theme.spacing(5),
    marginTop: theme.spacing(6),
  },
  cancel: {
    height: theme.spacing(5),
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    "&:hover": {
      backgroundColor: transparentize(0.6, theme.colors.white),
    },
  },
  priceWrapper: {
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.white}`,
  },
  priceToken: {
    fontSize: 20,
    color: theme.colors.white,
  },
  priceUsd: { fontSize: 20, color: theme.colors.primary40 },
}));

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}

export const CancelOrderConfirmStep = (props: IProps) => {
  const { onCancel, onConfirm } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography align="left" className={classes.description}>
        Do you really want to cancel this bid?
      </Typography>
      <Button
        className={classes.place}
        color="primary"
        fullWidth
        onClick={onConfirm}
        variant="contained"
      >
        CONFIRM
      </Button>
      <Button
        className={classes.cancel}
        fullWidth
        onClick={onCancel}
        variant="contained"
      >
        CANCEL
      </Button>
    </div>
  );
};
