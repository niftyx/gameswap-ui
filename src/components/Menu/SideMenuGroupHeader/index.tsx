import { Hidden, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
    padding: `${theme.spacing(0.125)}px ${theme.spacing(0.5)}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.colors.text.default,
  },
  icon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  title: {
    fontSize: "14px",
    lineHeight: "19px",
  },
}));

interface IProps {
  title: string;
  className?: string;
  moreItems: [
    {
      title: string;
      onClick: () => void;
    }
  ];
}

export const SideMenuGroupHeader = (props: IProps) => {
  const { moreItems, title } = props;
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.title} component="div">
        {title}
      </Typography>
    </div>
  );
};
