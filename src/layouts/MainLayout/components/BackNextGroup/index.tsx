import { IconButton, makeStyles } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(1.25),
    },
  },
  button: {
    borderColor: theme.colors.border.primary,
    borderStyle: "solid",
    borderWidth: 1,
    width: theme.spacing(5.5),
    height: theme.spacing(5.5),
    borderRadius: theme.spacing(0.5),
    "& svg": {
      color: theme.colors.icon.active,
    },
    "&:disabled": {
      "& svg": {
        color: theme.colors.icon.disabled,
      },
    },
  },
}));

const BackNextGroup = () => {
  const classes = useStyles();
  const history = useHistory();

  const backDisabled = false;
  const nextDisabled = true;

  const onNext = () => {
    history.go(1);
  };
  const onBack = () => {
    history.go(-1);
  };

  return (
    <div className={classes.container}>
      <IconButton
        className={classes.button}
        disabled={backDisabled}
        onClick={onBack}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        className={classes.button}
        disabled={nextDisabled}
        onClick={onNext}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </div>
  );
};

export default BackNextGroup;
