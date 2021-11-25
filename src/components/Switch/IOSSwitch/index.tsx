import {
  Switch,
  SwitchClassKey,
  SwitchProps,
  createStyles,
  withStyles,
} from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

export const IOSSwitch = withStyles((theme) =>
  createStyles({
    root: {
      width: theme.spacing(5),
      height: theme.spacing(3),
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 2,
      "& + $track": {
        backgroundColor: theme.colors.primary60,
      },
      color: theme.colors.white,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme.colors.white,
        "& + $track": {
          backgroundColor: theme.colors.green,
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: theme.colors.primary60,
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 20,
      height: 20,
    },
    track: {
      borderRadius: 24 / 2,
      border: `1px solid ${transparentize(0.4, theme.colors.primary100)}`,
      backgroundColor: transparentize(0.4, theme.colors.primary100),
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
