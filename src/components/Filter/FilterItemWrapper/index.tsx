import { Typography, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1)}px 0`,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2.25),
    userSelect: "none",
  },
  content: {
    overflow: "hidden",
    maxHeight: 0,
    transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
    "&.expanded": {
      maxHeight: 1000,
      transition: "max-height 1s ease-in-out",
    },
  },
  button: {
    color: theme.colors.text.default,
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

interface IProps {
  className?: string;
  title: string;
  children: React.ReactNode | React.ReactNode[];
  enabled?: boolean;
  onToggle?: () => void;
}

const FilterItemWrapper = (props: IProps) => {
  const classes = useStyles();
  const { enabled = false } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header} onClick={props.onToggle}>
        <Typography className={classes.title} component="div">
          {props.title}
        </Typography>
        <div className={classes.button}>
          {enabled ? <RemoveIcon /> : <AddIcon />}
        </div>
      </div>
      <div className={clsx(classes.content, enabled ? "expanded" : "")}>
        {props.children}
      </div>
    </div>
  );
};

export default FilterItemWrapper;
