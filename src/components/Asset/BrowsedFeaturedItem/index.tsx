import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { IGame } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1.125),
  },
  content: {
    position: "relative",

    borderRadius: theme.spacing(1),
    border: `8px solid ${theme.colors.transparent}`,
    transition: "all 0.3s",
    "&.active": {
      borderColor: theme.colors.background.fourth,
    },
    height: 200,
    [theme.breakpoints.down("md")]: {
      height: 160,
    },
    [theme.breakpoints.down("sm")]: {
      height: 130,
    },
    [theme.breakpoints.down("xs")]: {
      height: 100,
    },
  },
  img: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: theme.spacing(1),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
  },
}));

interface IProps {
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrowsedFeaturedItem = (props: IProps & IGame) => {
  const classes = useStyles();

  const { active = false, headerImageUrl: backgroundImage, onClick } = props;

  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      <div className={clsx(classes.content, active ? "active" : "")}>
        <div
          className={classes.img}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </div>
    </div>
  );
};
