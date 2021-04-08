import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { useState } from "react";
import { ICollection } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${transparentize(0.9, theme.colors.text.default)}`,
    borderRadius: 6,
    overflow: "hidden",
    width: 300,
    minWidth: 300,
    height: 180,
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: 250,
      minWidth: 250,
      height: 150,
    },
  },
  content: {
    width: "100%",
    height: "100%",
    opacity: 0,
    transition: "all 0.5s",
    position: "relative",
    "&.visible": {
      opacity: 1,
    },
  },
  textContent: {
    padding: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 5,
  },
  contentImage: {
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    "&:before": {
      content: `" "`,
      backgroundImage:
        "linear-gradient(333deg, rgba(58, 62, 69, 0.1) 36%, rgba(10, 10, 10, 0.6) 64%)",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  loadWrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    top: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fakeImage: {
    opacity: 0,
    zIndex: -2,
    visibility: "hidden",
  },
  name: {
    color: theme.colors.text.default,
    fontSize: 16,
    fontWeight: 500,
  },
  description: {
    color: theme.colors.text.third,
    fontSize: 14,
    fontWeight: 500,
  },
}));

interface IProps {
  className?: string;
  collection: ICollection;
}

interface IState {
  imageLoaded: boolean;
}

export const CollectionItem = (props: IProps) => {
  const classes = useStyles();
  const { collection } = props;
  const [state, setState] = useState<IState>({ imageLoaded: false });
  const setImageLoaded = (imageLoaded: boolean) =>
    setState((prev) => ({ ...prev, imageLoaded }));

  return (
    <div className={clsx(classes.root, props.className)}>
      {!state.imageLoaded && (
        <div className={classes.loadWrapper}>
          <CircularProgress size={40} />
        </div>
      )}

      <div
        className={clsx(classes.content, state.imageLoaded ? "visible" : "")}
      >
        <div className={classes.textContent}>
          <Typography className={classes.name}>{collection.name}</Typography>
          <Typography className={classes.description}>
            {collection.description}
          </Typography>
        </div>
        <div
          className={classes.contentImage}
          style={{
            backgroundImage: state.imageLoaded
              ? `url(${collection.imageUrl})`
              : "",
          }}
        />
      </div>

      <img
        alt="fake"
        className={classes.fakeImage}
        onLoad={() => setImageLoaded(true)}
        src={collection.imageUrl}
      />
    </div>
  );
};
