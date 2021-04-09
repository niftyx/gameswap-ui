import { IconButton, makeStyles } from "@material-ui/core";
import { ReactComponent as ShareIcon } from "assets/svgs/close-outline.svg";
import clsx from "clsx";
import { transparentize } from "polished";
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

export const AssetSharePopover = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <IconButton className={classes.button}>
        <ShareIcon />
      </IconButton>
    </div>
  );
};
