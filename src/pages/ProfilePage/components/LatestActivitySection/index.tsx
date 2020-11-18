import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    marginTop: theme.spacing(2),
    "& > * + *": {
      marginTop: theme.spacing(1.125),
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
  },
  header: {},
}));

interface IProps {
  className?: string;
}
interface IState {
  items: any[];
}

export const LatestActivitySection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ items: [] });

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          LATEST ACTIVITY
        </Typography>
      </div>

      <div className={classes.content}></div>
    </div>
  );
};
