import {
  FormControl,
  FormControlProps,
  InputLabelProps,
  SwitchProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { IOSSwitch } from "components/Switch";
import { transparentize } from "polished";
import React from "react";

import { FormInputLabel } from "../FormInputLabel";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
  },
  left: {
    flex: 1,
  },
  label: {
    color: theme.colors.white,
  },
  subLabel: {
    color: transparentize(0.4, theme.colors.white),
    fontSize: theme.spacing(1.6125),
    marginTop: theme.spacing(2.5),
  },
}));

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  InputProps: SwitchProps;
  label?: string;
  subLabel?: string;
}

export const FormSwitchField = (props: IProps) => {
  const { className } = props;
  const classes = useStyles();
  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      <div className={classes.content}>
        <div className={classes.left}>
          {props.label && (
            <FormInputLabel
              className={classes.label}
              title={props.label}
              {...props.InputLabelProps}
            />
          )}
          {props.subLabel && (
            <Typography className={classes.subLabel}>
              {props.subLabel}
            </Typography>
          )}
        </div>
        <IOSSwitch {...props.InputProps} />
      </div>
    </FormControl>
  );
};
