import { IconButton, makeStyles } from "@material-ui/core";
import { ReactComponent as ShareIcon } from "assets/svgs/share.svg";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    border: `1px solid ${transparentize(0.4, theme.colors.text.default)}`,
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
