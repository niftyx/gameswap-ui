import { IconButton, makeStyles } from "@material-ui/core";
import { ReactComponent as MoreIcon } from "assets/svgs/more-in-circle.svg";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    padding: 0,
    "& svg": {
      width: 32,
      height: 32,
    },
  },
}));

interface IProps {
  className?: string;
}

export const AssetMorePopover = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <IconButton className={classes.button}>
        <MoreIcon />
      </IconButton>
    </div>
  );
};
