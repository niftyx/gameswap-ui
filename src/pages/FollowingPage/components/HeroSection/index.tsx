import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 200,
    maxHeight: 300,
    height: "30vh",
    backgroundImage: "url(/svgs/backgrounds/follow-bg.png)",
    backgroundSize: "cover",
    padding: 24,
    display: "flex",
    flexDirection: "column-reverse",
  },
  content: {},
  title: {
    color: theme.colors.white,
    fontSize: 40,
    fontWeight: 500,
  },
  description: {
    marginTop: 8,
    color: theme.colors.primary40,
    fontSize: 14,
  },
}));

export const HeroSection = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography className={classes.title}>Following</Typography>
        <Typography className={classes.description}>
          Everything you follow in one place
        </Typography>
      </div>
    </div>
  );
};
