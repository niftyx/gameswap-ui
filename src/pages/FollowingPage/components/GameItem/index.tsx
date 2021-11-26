import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: { width: "100%" },
  imgWrapper: {
    paddingTop: "56%",
    backgroundImage: "url(/images/backgrounds/home_bg_5.jpg)",
    backgroundSize: "cover",
    borderRadius: 8,
    overflow: "hidden",
  },
  headerWrapper: {
    margin: "8px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
  },
  numWrapper: {
    fontSize: 14,
    color: theme.colors.primary40,
    display: "flex",
    alignItems: "center",
  },
  tagWrapper: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    margin: "0 -4px",
  },
  tag: {
    color: theme.colors.white,
    margin: 4,
    border: `1px solid ${theme.colors.primary80}`,
    borderRadius: 100,
    height: 24,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    fontSize: 12,
  },
}));

export const GameItem = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.imgWrapper}></div>
      <div className={classes.headerWrapper}>
        <Typography className={classes.title}>Cyberpunkk</Typography>
        <Typography className={classes.numWrapper}>
          <img alt="heart" src="/svgs/icons/user-heart.svg" />
          57.2K
        </Typography>
      </div>
      <div className={classes.tagWrapper}>
        <span className={classes.tag}>Action</span>
        <span className={classes.tag}>Action</span>
        <span className={classes.tag}>Action</span>
        <span className={classes.tag}>Action</span>
        <span className={classes.tag}>Action</span>
      </div>
    </div>
  );
};
