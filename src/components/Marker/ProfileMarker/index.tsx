import {
  Avatar,
  Button,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as ProTraderIcon } from "assets/svgs/medal.svg";
import clsx from "classnames";
import React from "react";
import { EProfileMarker } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
  },
  text: {
    fontSize: theme.spacing(1.6125),
    color: theme.colors.text.default,
  },
  icon: {
    paddingBottom: theme.spacing(0.5),
  },
}));

interface IProps {
  className?: string;
  marker: EProfileMarker;
  showLabel?: boolean;
}

export const ProfileMarker = (props: IProps) => {
  const classes = useStyles();
  const { className, marker, showLabel = true } = props;

  return (
    <div className={clsx(classes.root, className)}>
      {marker === EProfileMarker.ProTrader && (
        <ProTraderIcon className={classes.icon} />
      )}
      {showLabel && (
        <Typography className={classes.text} component="div">
          {marker}
        </Typography>
      )}
    </div>
  );
};
