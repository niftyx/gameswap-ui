import { Typography, makeStyles } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    transition: "all 0.5s",
    "&:hover": {
      "& div": {
        "& div": {
          borderColor: theme.colors.purple60,
          backgroundColor: theme.colors.primary85,
          color: theme.colors.white,
        },
        "& p": {
          color: theme.colors.white,
        },
      },
    },
    "& + &": {
      marginLeft: 24,
    },
  },
  content: {
    width: 240,
    height: 180,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  imgWrapper: {
    borderRadius: 4,
    backgroundColor: theme.colors.primary90,
    border: `2px solid ${theme.colors.primary85}`,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.4s",
    color: theme.colors.primary40,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 200,
    color: theme.colors.primary40,
    transition: "all 0.4s",
  },
}));

interface IProps {
  link: string;
  title: string;
  image: React.ElementType;
}

export const AssetCreateOption = (props: IProps) => {
  const classes = useStyles();
  const AssetIcon = props.image;
  return (
    <NavLink className={classes.root} to={props.link}>
      <div className={classes.content}>
        <div className={classes.imgWrapper}>
          <AssetIcon />
        </div>
        <Typography align="center" className={classes.text}>
          {props.title}
        </Typography>
      </div>
    </NavLink>
  );
};
