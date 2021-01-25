import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { BrowsedFeaturedItem } from "components";
import React, { useState } from "react";
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
    padding: `0 ${theme.spacing(1.5)}px`,
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  selectedId?: string;
}

export const FeaturedItemsSection = (props: IProps) => {
  const classes = useStyles();

  const [state, setState] = useState<IState>({});

  const selectItem = (id: string) =>
    setState((prevState) => ({ ...prevState, selectedId: id }));

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
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
    {
      id: "i6i234",
      title: "Horizon Zero Dawn",
      backgroundImage: "/images/backgrounds/horizon.png",
    },
    {
      id: "ne5gewfg",
      title: "Test",
      backgroundImage: "/images/backgrounds/no-mans-sky.png",
    },
  ];

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.slick}>
        <Slider {...settings}>
          {trendingGames.map((game: IGameItem) => (
            <BrowsedFeaturedItem
              active={state.selectedId === game.id}
              key={game.id}
              onClick={() => selectItem(game.id)}
              {...game}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};
