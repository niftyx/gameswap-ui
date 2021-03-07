import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  carousel: {
    height: "100%",
    "& .carousel-slider": {
      height: "100%",
      "& .div": {
        height: "100%",
        overflowY: "hidden",
      },
      "& .carousel-status": {
        display: "none",
      },
      "& .control-dots": {
        bottom: 0,
        top: 0,
        right: 0,
        height: "100%",
        width: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        "& > * + *": {
          marginTop: theme.spacing(1),
        },
      },
    },
  },
  imgItem: {
    height: "50vh",
    backgroundPositionY: "center",
    backgroundSize: "cover",
    opacity: 0.3,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
  },
  title: {
    position: "absolute",
    left: theme.spacing(2),
    top: theme.spacing(4),
    color: theme.colors.text.default,
    fontSize: 13,
  },
  comments: {
    position: "absolute",
    left: theme.spacing(2),
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  comment: {
    fontSize: 70,
    lineHeight: "85px",
    color: theme.colors.text.default,
    fontWeight: "bold",
  },
  description: {
    fontSize: 15,
    lineHeight: "36px",
    color: transparentize(0.4, theme.colors.text.default),
    maxWidth: 500,
  },
  row: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    marginTop: theme.spacing(6),
    "& > * + *": {
      marginLeft: theme.spacing(1.5),
    },
  },
  button: {
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
}));

interface IProps {
  className?: string;
}

export const HeroCarousel = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();

  const onBrowse = () => {
    history.push("/browse");
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <Carousel axis="vertical" className={classes.carousel} showArrows={false}>
        <div
          className={classes.imgItem}
          style={{
            backgroundImage: `url("/images/backgrounds/launch-pad.png")`,
          }}
        />
        <div
          className={classes.imgItem}
          style={{
            backgroundImage: `url("/images/backgrounds/launch-pad.png")`,
          }}
        />
        <div
          className={classes.imgItem}
          style={{
            backgroundImage: `url("/images/backgrounds/launch-pad.png")`,
          }}
        />

        <div
          className={classes.imgItem}
          style={{
            backgroundImage: `url("/images/backgrounds/launch-pad.png")`,
          }}
        />
      </Carousel>
      <Typography className={classes.title} component="div">
        NOW IN THE LAUNCHPAD
      </Typography>
      <div className={classes.comments}>
        <Typography className={classes.comment} component="div">
          Mystical Warriors 2
        </Typography>
        <Typography className={classes.description} component="div">
          Mystical Warriors 2 is a fast-paced, competitive online game that
          blends the speed and intensity of an RTS with RPG elements.
        </Typography>
        <div className={classes.row}>
          <Button
            className={classes.button}
            color="primary"
            onClick={onBrowse}
            variant="contained"
          >
            START FARMING
          </Button>
          <Button
            className={clsx(commonClasses.transparentButton, classes.button)}
            variant="contained"
          >
            INFO FOR LP&apos;S
          </Button>
        </div>
      </div>
    </div>
  );
};
