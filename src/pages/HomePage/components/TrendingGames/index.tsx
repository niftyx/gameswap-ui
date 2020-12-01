import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { BackNextGroup, GamePreview } from "components";
import React, { useRef } from "react";
import Slider from "react-slick";
import { IGameItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.text.default,
    fontSize: 15,
  },
  slick: {
    margin: `0 -${theme.spacing(1.5)}px`,
  },
}));

interface IProps {
  className?: string;
}

export const TrendingGames = (props: IProps) => {
  const classes = useStyles();
  const sliderRef = useRef();

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  const trendingGames: IGameItem[] = [
    {
      id: "rhwf",
      title: "SkyFall 3",
      backgroundImage: "/images/backgrounds/skyfall.png",
    },
    {
      id: "34535",
      title: "Cyberpunk Assault",
      backgroundImage: "/images/backgrounds/cyber-assault.png",
    },
    {
      id: "23424",
      title: "No Man's Sky",
      backgroundImage: "/images/backgrounds/no-mans-sky.png",
    },
    {
      id: "i6i",
      title: "Horizon Zero Dawn",
      backgroundImage: "/images/backgrounds/horizon.png",
    },
    {
      id: "ne5",
      title: "Test",
      backgroundImage: "/images/backgrounds/no-mans-sky.png",
    },
  ];

  const onBack = () => {
    (sliderRef.current as any).slickPrev();
  };

  const onNext = () => {
    (sliderRef.current as any).slickNext();
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          TRENDING GAMES
        </Typography>
        <div>
          <BackNextGroup onBack={onBack} onNext={onNext} />
        </div>
      </div>

      <div className={classes.slick}>
        <Slider {...settings} ref={sliderRef as any}>
          {trendingGames.map((game: IGameItem) => (
            <GamePreview key={game.id} {...game} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
