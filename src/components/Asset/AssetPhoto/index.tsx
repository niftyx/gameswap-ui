import { makeStyles } from "@material-ui/core";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import { ReactComponent as AudioSvg } from "assets/svgs/sword.svg";
import { ReactComponent as VideoSvg } from "assets/svgs/video.svg";
import clsx from "classnames";
import React from "react";
import { EFileType } from "utils/enums";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    position: "relative",
  },
  content: {
    width: "100%",
    outline: "none",
    backgroundPosition: "center",
    height: "100%",
  },
  img: {
    display: "none",
  },
  bImg: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  icon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    fill: theme.colors.text.default,
    width: 24,
    height: 24,
    "&.audio": {
      left: "25%",
      top: "25%",
      width: "50%",
      height: "50%",
    },
  },
}));

interface IProps {
  uri: string;
  type: EFileType;
  className?: string;
  onLoad?: () => void;
  preview?: boolean;
}

export const AssetPhoto = (props: IProps) => {
  const classes = useStyles();
  const { preview = true } = props;
  const renderContent = () => {
    switch (props.type) {
      case EFileType.Image:
        return (
          <div
            className={clsx(classes.content, classes.bImg)}
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
          !preview && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio
              className={classes.content}
              controls
              onLoad={props.onLoad}
              src={props.uri}
            >
              Your browser does not support the <code>audio</code> element
            </audio>
          )
        );
      case EFileType.Video:
        return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            autoPlay={preview}
            className={classes.content}
            controls={!preview}
            onLoadStart={props.onLoad}
          >
            <source src={props.uri}></source>
          </video>
        );
      default:
        return <div className={props.className} />;
    }
  };

  const renderIcon = () => {
    switch (props.type) {
      case EFileType.Image:
        return null;
      case EFileType.Video:
        return <VideoSvg className={classes.icon} />;
      case EFileType.Audio:
        return <AudiotrackIcon className={clsx(classes.icon, "audio")} />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx(props.className, classes.root)}>
      {renderContent()}
      {renderIcon()}
    </div>
  );
};
