import { makeStyles } from "@material-ui/core";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import { ReactComponent as VideoSvg } from "assets/svgs/video.svg";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
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
    backgroundSize: "cover",
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
  videoContent: {
    width: "100%",
    outline: "none",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    "& video": {
      position: "absolute",
      left: "50%",
      top: "50%",
      opacity: 0,
      transform: "translate(-50%, -50%)",
      transition: "all 0.4s",
    },
  },
}));

interface IProps {
  uri: string;
  type: EFileType;
  className?: string;
  onLoad?: () => void;
}

interface IState {
  videoWidth: number;
  videoHeight: number;
}

export const AssetPhoto = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    videoHeight: 0,
    videoWidth: 0,
  });

  useEffect(() => {
    setState(() => ({
      videoHeight: 0,
      videoWidth: 0,
    }));
  }, [props.uri]);

  const isVideoLoaded = state.videoHeight !== 0 && state.videoWidth !== 0;

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
        return null;
      // return (
      //   // eslint-disable-next-line jsx-a11y/media-has-caption
      //   <audio
      //     className={classes.content}
      //     controls
      //     onLoad={props.onLoad}
      //     src={props.uri}
      //   >
      //     Your browser does not support the <code>audio</code> element
      //   </audio>
      // );
      case EFileType.Video:
        return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <div className={classes.videoContent}>
            <video
              autoPlay
              className={classes.content}
              controls={false}
              id={`preview-video-${props.uri}`}
              loop
              muted
              onLoadStart={props.onLoad}
              onLoadedMetadata={() => {
                const vid = document.getElementById(
                  `preview-video-${props.uri}`
                ) as any;
                setState(() => ({
                  videoWidth: vid.videoWidth,
                  videoHeight: vid.videoHeight,
                }));
              }}
              style={
                isVideoLoaded
                  ? {
                      opacity: 1,
                      width:
                        state.videoWidth > state.videoHeight ? "auto" : "100%",
                      height:
                        state.videoWidth < state.videoHeight ? "auto" : "100%",
                    }
                  : {}
              }
            >
              <source src={props.uri}></source>
            </video>
          </div>
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
