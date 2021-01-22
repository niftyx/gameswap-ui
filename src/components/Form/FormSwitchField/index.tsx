import {
  FormControl,
  FormControlProps,
  InputLabelProps,
  Switch,
  SwitchClassKey,
  SwitchProps,
  Typography,
  createStyles,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

import { FormInputLabel } from "../FormInputLabel";

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const IOSSwitch = withStyles((theme) =>
  createStyles({
    root: {
      width: theme.spacing(5),
      height: theme.spacing(3),
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 2,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: theme.colors.background.seventh,
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: theme.colors.background.seventh,
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 20,
      height: 20,
    },
    track: {
      borderRadius: 24 / 2,
      border: `1px solid ${transparentize(
        0.4,
        theme.colors.background.primary
      )}`,
      backgroundColor: transparentize(0.4, theme.colors.background.primary),
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  })
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      disableRipple
      focusVisibleClassName={classes.focusVisible}
      {...props}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
  },
  left: {
    flex: 1,
  },
  label: {
    color: theme.colors.text.default,
  },
  subLabel: {
    color: transparentize(0.4, theme.colors.text.default),
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
