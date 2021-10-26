import { Typography, makeStyles } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    transition: "all 0.5s",
    color: theme.colors.white,
    "&:hover": {
      color: transparentize(0.4, theme.colors.white),
    },
    "& + &": {
      marginLeft: theme.spacing(1.5),
    },
  },
  content: {
    width: theme.spacing(20),
    height: theme.spacing(8),
    borderRadius: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: transparentize(0.3, theme.colors.primary80),
  },
  text: {
    fontSize: theme.spacing(2.25),
    fontWeight: 500,
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
        <Typography align="center" className={classes.text} component="span">
          {props.title}
        </Typography>
      </div>
    </NavLink>
  );
};
