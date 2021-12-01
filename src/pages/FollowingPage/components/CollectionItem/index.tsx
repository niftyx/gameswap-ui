import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary90,
    borderRadius: 4,
    overflow: "hidden",
  },
  content: {
    textAlign: "center",
    position: "relative",
  },
  imgWrapper: {
    position: "relative",
    width: "100%",
    paddingTop: "48%",
    background:
      "linear-gradient(103.54deg, #09090B 22.29%, rgba(9, 9, 11, 0.5) 49.71%, #09090B 76.15%), url(.png)",
    filter: "blur(20px)",
  },
  img: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginTop: -48,
  },
  title: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: 700,
    color: theme.colors.white,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.primary70,
    marginBottom: 10,
  },
}));

export const CollectionItem = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.imgWrapper}></div>
      <div className={classes.content}>
        <img alt="img" className={classes.img} src="/images/mock/artist.png" />
        <Typography className={classes.title}>
          OG Sylvan’s Game Massiv...
        </Typography>
        <Typography className={classes.description}>
          ERC721 ・12 items
        </Typography>
      </div>
    </div>
  );
};
