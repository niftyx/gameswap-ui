import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2.125)}px ${theme.spacing(3)}px`,
  },
}));

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};

export default PageContainer;
