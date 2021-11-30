import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BackNextGroup } from "components";
import React, { useRef } from "react";
import Slider from "react-slick";

import { CategoryItem } from "../CategoryItem";

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
    color: theme.colors.white,
    fontSize: 24,
  },
  slick: {
    margin: `0 -${theme.spacing(1.5)}px`,
  },
}));

interface IProps {
  title: string;
  className?: string;
}

export const CategorySubSection = (props: IProps) => {
  const classes = useStyles();
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  const sliderRef = useRef();

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
          {props.title}
        </Typography>
        <div>
          <BackNextGroup onBack={onBack} onNext={onNext} />
        </div>
      </div>

      <div className={classes.slick}>
        <Slider {...settings} ref={sliderRef as any}>
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
        </Slider>
      </div>
    </div>
  );
};
