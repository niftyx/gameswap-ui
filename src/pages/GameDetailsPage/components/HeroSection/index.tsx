import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import clsx from "clsx";
import { PLATFORM_ICONS } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
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
  pencil: {
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(3),
    color: theme.colors.text.default,
    backgroundColor: transparentize(0.7, theme.colors.text.default),
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
  platformIcon: {
    width: 16.8,
    height: 16.7,
  },
}));

interface IProps {
  className?: string;
  game: IGame;
  onEditGame: () => void;
}

interface IState {
  imageLoaded: boolean;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { game } = props;
  const [state, setState] = useState<IState>({
    imageLoaded: false,
  });

  const { account } = useConnectedWeb3Context();

  const isOwner = account?.toLowerCase() === game.owner?.toLowerCase();

  const setImageLoaded = (imageLoaded: boolean) =>
    setState((prev) => ({ ...prev, imageLoaded }));

  const PlatformIcon = PLATFORM_ICONS[game.platform];

  const showContent = !game.headerImageUrl || state.imageLoaded;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={clsx(classes.imgItem, showContent ? "visible" : "")}
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
      {isOwner && showContent && (
        <IconButton className={classes.pencil} onClick={props.onEditGame}>
          <CreateIcon />
        </IconButton>
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
                <PlatformIcon className={classes.platformIcon} />
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
