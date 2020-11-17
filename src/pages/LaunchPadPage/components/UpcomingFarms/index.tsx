import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React, { useState } from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
  },
  toolbar: {
    flex: 1,
  },
}));

interface IProps {
  className?: string;
}
interface IState {
  assets: IAssetItem[];
}

export const UpcomingFarms = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ assets: [] });

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          UPCOMING FARMS
        </Typography>
      </div>

      <div className={classes.assets}></div>
    </div>
  );
};
