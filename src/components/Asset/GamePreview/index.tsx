import { Typography, makeStyles } from "@material-ui/core";
import {
  IconTrendingGameImagePlaceholder,
  IconTrendingGameTitlePlaceholder,
} from "assets/icons";
import clsx from "clsx";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";
import { IGame } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    textDecoration: "none",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    padding: theme.spacing(1.5),
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
  },
  content: {
    position: "relative",
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
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  imgPlaceholder: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: theme.spacing(1),
    objectFit: "cover",
    width: "100%",
    height: "100%",
    zIndex: 99,
  },
  titleWrapper: { marginTop: theme.spacing(1.125), position: "relative" },
  titlePlaceholder: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "50%",
    zIndex: 99,
  },
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

interface IState {
  loaded: boolean;
}

export const GamePreview = (props: IProps & IGame) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({ loaded: false });

  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  const { headerImageUrl: backgroundImage, name: title } = props;

  return (
    <div>
      <NavLink
        className={clsx(
          classes.root,
          props.className,
          commonClasses.normalHover
        )}
        to={`/games/${props.id}`}
      >
        <div className={classes.content}>
          {!state.loaded && (
            <div className={classes.imgPlaceholder}>
              <IconTrendingGameImagePlaceholder />
            </div>
          )}
          <img
            alt="img"
            className={clsx(
              classes.img,
              commonClasses.fadeAnimation,
              state.loaded ? "visible" : ""
            )}
            onLoad={() => setLoaded(true)}
            src={backgroundImage}
          />
        </div>
        <div className={classes.titleWrapper}>
          {!state.loaded && (
            <div className={classes.titlePlaceholder}>
              <IconTrendingGameTitlePlaceholder />
            </div>
          )}
          <Typography
            className={clsx(
              classes.title,
              commonClasses.fadeAnimation,
              state.loaded ? "visible" : ""
            )}
            component="div"
          >
            {title}
          </Typography>
        </div>
      </NavLink>
    </div>
  );
};
