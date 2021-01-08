import { Typography, makeStyles } from "@material-ui/core";
import {
  IconTrendingGameImagePlaceholder,
  IconTrendingGameTitlePlaceholder,
} from "assets/icons";
import clsx from "classnames";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IGameItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    padding: theme.spacing(1.5),
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
  },
  content: {
    position: "relative",
    paddingTop: "59%",
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

export const GamePreview = (props: IProps & IGameItem) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({ loaded: false });

  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  const { backgroundImage, title } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
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
    </div>
  );
};
