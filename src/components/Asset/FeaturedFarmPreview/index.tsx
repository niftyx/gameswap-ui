import { Button, Hidden, Typography, makeStyles } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { IFeaturedFarmItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    paddingTop: "65%",
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2.5),
  },
  description: {
    color: transparentize(0.4, theme.colors.text.default),
    fontSize: theme.spacing(2),
  },
  tokenDescription: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
    marginBottom: theme.spacing(2),
  },
  content: {
    position: "absolute",
    padding: theme.spacing(3.5),
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(1.125),
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
    opacity: "0.6",
  },
  buttonFarm: {
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
  buttonFav: {
    width: theme.spacing(5.5),
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

export const FeaturedFarmPreview = (props: IProps & IFeaturedFarmItem) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const {
    backgroundImage,
    description,
    isFavorite,
    onClick,
    title,
    tokenDescription,
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={classes.img}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={classes.content}>
        <div>
          <Typography className={classes.title} component="div">
            {title}
          </Typography>
          <Typography className={classes.description} component="div">
            {description}
          </Typography>
        </div>

        <Typography className={classes.tokenDescription} component="div">
          {tokenDescription}
        </Typography>
        <div className={classes.row}>
          <Button
            className={classes.buttonFarm}
            color="primary"
            variant="contained"
          >
            FARM
          </Button>
          <Button
            className={clsx(commonClasses.transparentButton, classes.buttonFav)}
            variant="contained"
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
};
