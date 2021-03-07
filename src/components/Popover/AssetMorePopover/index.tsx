import { IconButton, makeStyles } from "@material-ui/core";
import { ReactComponent as MoreIcon } from "assets/svgs/more.svg";
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
