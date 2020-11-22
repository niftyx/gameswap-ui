import {
  LinearProgress,
  Typography,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.spacing(15),
    marginLeft: "auto",
  },
  row: {
    display: "flex",
    color: theme.colors.text.default,
    justifyContent: "space-between",
    marginBottom: theme.spacing(1.75),
  },
  label: {
    opacity: 0.6,
    whiteSpace: "nowrap",
    fontSize: theme.spacing(1.6125),
  },
  value: {
    fontSize: theme.spacing(1.6125),
  },
  progressbar: {
    height: theme.spacing(0.6125),
  },
}));

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: theme.spacing(0.6125),
    borderRadius: theme.spacing(0.5),
  },
  colorPrimary: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: transparentize(0.9, theme.colors.text.default),
  },
  bar: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.colors.background.seventh,
  },
}))(LinearProgress);

interface IProps {
  point: number;
  className?: string;
}

export const TrustPoint = (props: IProps) => {
  const { className, point } = props;
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography className={classes.label} component="span">
          TRUST POINTS
        </Typography>
        <Typography className={classes.value} component="span">
          {point}
        </Typography>
      </div>
      <BorderLinearProgress
        className={classes.progressbar}
        color="primary"
        value={50}
        variant="determinate"
      />
    </div>
  );
};
