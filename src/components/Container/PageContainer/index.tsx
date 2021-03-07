import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    height: "100%",
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
