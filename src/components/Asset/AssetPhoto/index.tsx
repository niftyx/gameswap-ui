import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import { EFileType } from "utils/enums";

const useStyles = makeStyles(() => ({
  root: {
    width: "auto",
    outline: "none",
  },
  img: {
    display: "none",
  },
  bImg: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
}));

interface IProps {
  uri: string;
  type: EFileType;
  className?: string;
  onLoad?: () => void;
}

export const AssetPhoto = (props: IProps) => {
  const classes = useStyles();
  switch (props.type) {
    case EFileType.Image:
      return (
        <div
          className={clsx(props.className, classes.root, classes.bImg)}
          style={{ backgroundImage: `url(${props.uri})` }}
        >
          <img
            alt="asset_img"
            className={classes.img}
            onLoad={props.onLoad}
            src={props.uri}
          />
        </div>
      );
    case EFileType.Audio:
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          className={clsx(props.className, classes.root)}
          controls
          onLoad={props.onLoad}
          src={props.uri}
        >
          Your browser does not support the <code>audio</code> element
        </audio>
      );
    case EFileType.Video:
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          className={clsx(props.className, classes.root)}
          controls
          onLoadStart={props.onLoad}
        >
          <source src={props.uri}></source>
        </video>
      );
    default:
      return <div className={props.className} />;
  }
};
