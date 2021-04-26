import {
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { PLATFORM_ICONS } from "config/constants";
import { transparentize } from "polished";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IGame } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fakeImage: {
    opacity: 0,
    position: "absolute",
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },
  imgItem: {
    backgroundColor: transparentize(0.5, theme.colors.background.primary),
    height: "40vh",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    position: "relative",
    "&:before": {
      content: `" "`,
      backgroundImage: theme.colors.background.gradient3,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    opacity: 0,
    transition: "all 0.5s",
    "&.visible": {
      opacity: 1,
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: 13,
    fontWeight: 500,
  },
  comments: {
    position: "absolute",
    left: theme.spacing(3),
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 90,
    letterSpacing: "-5px",
    color: theme.colors.text.default,
    fontWeight: "bold",
    margin: "16px 0 12px 0",
  },
  row: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
  website: {
    display: "inline-flex",
    height: theme.spacing(4),
    minWidth: 120,
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsWrapper: {
    marginRight: 32,
    "& > * + *": {
      marginLeft: 32,
    },
  },
  detailItem: {
    textAlign: "center",
  },
  detailItemLabel: {
    color: theme.colors.text.default,
    fontSize: 13,
    fontWeight: 500,
  },
  detailItemContent: {
    marginTop: 12,
    color: theme.colors.text.third,
    fontSize: 16,
  },
  loadWrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    top: 24,
    bottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface IProps {
  className?: string;
  game: IGame;
}

interface IState {
  imageLoaded: boolean;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { game } = props;
  const [state, setState] = useState<IState>({ imageLoaded: false });

  const setImageLoaded = (imageLoaded: boolean) =>
    setState((prev) => ({ ...prev, imageLoaded }));

  const PlatformIcon = PLATFORM_ICONS[game.platform];

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={clsx(
          classes.imgItem,
          !game.headerImageUrl || state.imageLoaded ? "visible" : ""
        )}
        style={{
          backgroundImage:
            game.headerImageUrl && state.imageLoaded
              ? `url(${game.headerImageUrl})`
              : "",
        }}
      />
      {game.headerImageUrl && (
        <img
          alt="fake"
          className={classes.fakeImage}
          onLoad={() => setImageLoaded(true)}
          src={game.headerImageUrl}
        />
      )}
      {game.headerImageUrl && !state.imageLoaded ? (
        <div className={classes.loadWrapper}>
          <CircularProgress size={40} />
        </div>
      ) : (
        <div className={classes.comments}>
          <div>
            <Typography className={classes.title}>GAME</Typography>
            <Typography className={classes.name}>{game.name}</Typography>
            <div className={classes.row}>
              <Button
                className={classes.website}
                color="primary"
                variant="contained"
              >
                Follow
              </Button>
              <Button
                className={clsx(
                  classes.website,
                  commonClasses.transparentButton
                )}
              >
                Website
              </Button>
            </div>
          </div>
          <div className={clsx(classes.row, classes.detailsWrapper)}>
            <div className={classes.detailItem}>
              <Typography align="center" className={classes.detailItemLabel}>
                FOLLOWERS
              </Typography>
              <Typography align="center" className={classes.detailItemContent}>
                11,047
              </Typography>
            </div>
            <div className={classes.detailItem}>
              <Typography align="center" className={classes.detailItemLabel}>
                PLATFORM
              </Typography>
              <Typography align="center" className={classes.detailItemContent}>
                <PlatformIcon />
              </Typography>
            </div>
            <div className={classes.detailItem}>
              <Typography align="center" className={classes.detailItemLabel}>
                VERSION
              </Typography>
              <Typography align="center" className={classes.detailItemContent}>
                {game.version}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
