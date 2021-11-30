import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: { width: "100%", padding: theme.spacing(1.5) },
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
}));

export const CategoryItem = () => {
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
    </div>
  );
};
