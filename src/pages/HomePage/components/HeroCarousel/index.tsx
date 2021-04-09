import { Button, Typography, makeStyles } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import useCommonStyles from "styles/common";
import { IGameItem } from "utils/types";

const games: IGameItem[] = [
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  imgsWrapper: { height: "50vh", position: "relative" },
  imgItem: {
    backgroundPositionY: "bottom",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    opacity: 0,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    "&.active": {
      opacity: 1,
      transition: "all 0.7s",
    },
    "&.inactive": { transition: "none" },
  },
  comments: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: `0 ${theme.spacing(3)}px`,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&:before": {
      content: `" "`,
      backgroundImage:
        "linear-gradient(180deg, rgba(58, 62, 69, 0) 31%, black 82%)",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  comment: {
    zIndex: 2,
    fontSize: 50,
    lineHeight: "85px",
    color: theme.colors.text.default,
    fontWeight: "bold",
    [theme.breakpoints.down(1200)]: {
      fontSize: 50,
      lineHeight: "75px",
    },
    [theme.breakpoints.down(1050)]: {
      fontSize: 40,
      lineHeight: "55px",
    },
  },
  bottomRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down(1100)]: {
      flexDirection: "column",
    },
  },
  row: {
    display: "flex",
    width: "100%",
    alignItems: "center",

    "& > * + *": {
      marginLeft: theme.spacing(1.5),
    },
  },
  button: {
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
  slick: {
    width: 440,
    [theme.breakpoints.down(1100)]: {
      marginTop: 20,
      alignSelf: "flex-end",
    },
    [theme.breakpoints.down(1024)]: {
      width: 330,
    },
    "& .slick-slider": {
      "& .slick-arrow": {
        width: 24,
        height: 24,
        zIndex: 1,
        color: theme.colors.text.default,
        backgroundColor: "#3F8CFF",
        borderRadius: "50%",
        "&::before": {
          content: `""`,
          width: 24,
          height: 24,
          opacity: 0,
        },
        "&:hover": {
          backgroundColor: "#0c6dff",
        },
        "&.slick-prev": { left: -6 },
        "&.slick-next": { right: -6 },
      },
    },
  },
  slickItem: {
    cursor: "pointer",
    width: "100%",
    padding: "6px",
    outline: "none",
    display: "block !important",
  },
  slickItemContent: {
    paddingTop: "58%",
    position: "relative",
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 50%",
    borderRadius: 12,
    transition: "box-shadow .25s, -webkit-box-shadow .25s",
    "&:hover": {
      "-webkit-box-shadow": `0 0 6px 1px ${transparentize(
        0.2,
        theme.colors.background.fourth
      )}`,
      boxShadow: `0 0 6px 1px ${transparentize(
        0.2,
        theme.colors.background.fourth
      )}`,
    },
    "&.selected": {
      "-webkit-box-shadow": `0 0 6px 2px ${theme.colors.background.fourth}`,
      boxShadow: `0 0 6px 2px ${theme.colors.background.fourth}`,
    },
  },
  empty: { flex: 1 },
}));

interface IProps {
  className?: string;
}

interface IState {
  selectedId: string;
}

export const HeroCarousel = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();
  const [state, setState] = useState<IState>({ selectedId: games[0].id });
  const sliderRef = useRef(null);

  const settings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: (
      <span>
        <KeyboardArrowLeftIcon />
      </span>
    ),
    nextArrow: (
      <span>
        <KeyboardArrowRightIcon />
      </span>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
    afterChange: (index: number) => {
      setState((prevState) => ({ ...prevState, selectedId: games[index].id }));
    },
  };

  const onBrowse = () => {
    history.push("/browse");
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.imgsWrapper}>
        {games.map((game) => (
          <div
            className={clsx(
              classes.imgItem,
              state.selectedId === game.id ? "active" : "inactive"
            )}
            key={game.id}
            style={{
              backgroundImage: `url(${game.backgroundImage})`,
            }}
          />
        ))}
      </div>
      <div className={classes.comments}>
        <div className={classes.empty} />
        <Typography className={classes.comment} component="div">
          Create and trade in-game
          <br />
          NFT assets
        </Typography>
        <div className={classes.bottomRow}>
          <div className={classes.row}>
            <Button
              className={classes.button}
              color="primary"
              onClick={onBrowse}
              variant="contained"
            >
              BROWSE ITEMS
            </Button>
            <Button
              className={clsx(commonClasses.transparentButton, classes.button)}
              variant="contained"
            >
              HOW IT WORKS
            </Button>
          </div>
          <div className={classes.slick}>
            <Slider ref={sliderRef} {...settings}>
              {games.map((game, index) => {
                return (
                  <div
                    className={classes.slickItem}
                    key={game.id}
                    onClick={() => {
                      if (sliderRef && sliderRef.current) {
                        (sliderRef.current as any).slickGoTo(index);
                      }
                    }}
                  >
                    <div
                      className={clsx(
                        classes.slickItemContent,
                        game.id === state.selectedId ? "selected" : ""
                      )}
                      style={{
                        backgroundImage: `url(${game.backgroundImage})`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};
