import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BackNextGroup, CollectionPreview } from "components";
import { useGlobal } from "contexts";
import React, { useRef } from "react";
import Slider from "react-slick";
import { ICollection } from "utils/types";

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
    margin: `0 -${theme.spacing(1)}px`,
  },
}));

interface IProps {
  className?: string;
}

export const FeaturedCollections = (props: IProps) => {
  const classes = useStyles();
  const sliderRef = useRef();
  const {
    data: { collections },
  } = useGlobal();

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, collections.length),
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
          FEATURED COLLECTIONS
        </Typography>
        <div>
          <BackNextGroup onBack={onBack} onNext={onNext} />
        </div>
      </div>

      <div className={classes.slick}>
        <Slider {...settings} ref={sliderRef as any}>
          {collections.map((collection: ICollection) => (
            <CollectionPreview key={collection.id} {...collection} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
