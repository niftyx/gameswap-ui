import { IconButton, makeStyles } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(1.25),
    },
  },
  button: {
    borderColor: theme.colors.purple40,
    borderStyle: "solid",
    borderWidth: 1,
    width: theme.spacing(5.5),
    height: theme.spacing(5.5),
    borderRadius: 6,
    "& svg": {
      color: theme.colors.purple40,
    },
    "&:disabled": {
      "& svg": {
        color: theme.colors.purple60,
      },
    },
  },
}));

interface IProps {
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
}

const BackNextGroup = (props: IProps) => {
  const classes = useStyles();

  const { backDisabled = false, nextDisabled = false, onBack, onNext } = props;

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
