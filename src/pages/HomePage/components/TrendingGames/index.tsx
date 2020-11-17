import { Button, Hidden, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import Slider from "react-slick";
import useCommonStyles from "styles/common";
import { IGameItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {},
}));

interface IProps {
  className?: string;
}

export const TrendingGames = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  const trendingGames: IGameItem[] = [
    { title: "SkyFall 3", backgroundIcon: "/svgs/backgrounds/skyfall.svg" },
    {
      title: "Cyberpunk Assault",
      backgroundIcon: "/svgs/backgrounds/cyber-assault.svg",
    },
    {
      title: "No Man's Sky",
      backgroundIcon: "/svgs/backgrounds/no-mans-sky.svg",
    },
    {
      title: "Horizon Zero Dawn",
      backgroundIcon: "/svgs/backgrounds/horizon.svg",
    },
    { title: "Test", backgroundIcon: "/svgs/backgrounds/no-mans-sky.svg" },
  ];

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography component="div">Title</Typography>
      </div>

      <div>
        <Slider {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
      </div>
    </div>
  );
};
