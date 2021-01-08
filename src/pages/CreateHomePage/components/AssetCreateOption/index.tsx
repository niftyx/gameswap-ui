import { Typography, makeStyles } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    transition: "all 0.5s",
    color: theme.colors.text.default,
    "&:hover": {
      color: transparentize(0.2, theme.colors.text.default),
    },
  },
  content: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.colors.border.primary}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: theme.spacing(3),
  },
}));

interface IProps {
  link: string;
  title: string;
}

export const AssetCreateOption = (props: IProps) => {
  const classes = useStyles();
  return (
    <NavLink className={classes.root} to={props.link}>
      <div className={classes.content}>
        <Typography className={classes.text} component="span">
          {props.title}
        </Typography>
      </div>
    </NavLink>
  );
};
