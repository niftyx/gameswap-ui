import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BackNextGroup, GamePreview } from "components";
import { useGlobal } from "contexts";
import React, { useRef } from "react";
import Slider from "react-slick";
import { IGame } from "utils/types";

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
  const {
    data: { games: trendingGames },
  } = useGlobal();

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

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
          {trendingGames.map((game: IGame) => (
            <GamePreview key={game.id} {...game} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
