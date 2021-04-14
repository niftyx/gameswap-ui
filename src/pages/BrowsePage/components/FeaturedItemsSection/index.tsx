import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BrowsedFeaturedItem } from "components";
import { useGlobal } from "contexts";
import React, { useState } from "react";
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
  const {
    data: { games: trendingGames },
  } = useGlobal();

  const selectItem = (id: string) =>
    setState((prevState) => ({ ...prevState, selectedId: id }));

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.slick}>
        <Slider {...settings}>
          {trendingGames.map((game: IGame) => (
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
