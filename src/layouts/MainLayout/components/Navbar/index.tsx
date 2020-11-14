import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.custom.appNavbarWidth,
    position: "fixed",
    left: 0,
    top: theme.custom.appHeaderHeight,
    bottom: 0,
  },
}));

interface IProps {
  className?: string;
}

const Navbar = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={clsx(classes.root, commonClasses.scroll, props.className)}>
      Navbar
    </div>
  );
};

export default Navbar;
