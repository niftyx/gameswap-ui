import { Typography, makeStyles } from "@material-ui/core";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import VideocamIcon from "@material-ui/icons/Videocam";
import { transparentize } from "polished";
import React from "react";
import { getFileType } from "utils/asset";
import { EFileType } from "utils/enums";

import { IERC721FormValues } from "../ERC721CreateForm";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    top: theme.spacing(5),
  },
  content: {
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.colors.border.sixth}`,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    minHeight: theme.spacing(40),
  },
  title: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.default,
    fontWeight: "bold",
  },
  img: {
    width: "100%",
    margin: `${theme.spacing(2)}px 0`,
  },
  iconWrapper: {
    width: "100%",
    margin: `${theme.spacing(2)}px 0`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: transparentize(0.6, theme.colors.background.tenth),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: `${theme.spacing(4)}px 0`,
  },
  icon: {
    fontSize: theme.spacing(15),
    color: theme.colors.text.default,
  },
  name: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    fontWeight: 500,
  },
  price: {
    fontSize: theme.spacing(2),
    color: transparentize(0.2, theme.colors.text.default),
  },
  unlockWrapper: {
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.colors.border.sixth}`,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  unlockPlaceholder: {
    fontSize: theme.spacing(2),
    color: transparentize(0.5, theme.colors.text.default),
  },
  unlockData: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    whiteSpace: "pre-line",
  },
}));

interface IProps {
  data: IERC721FormValues;
}

export const ERC721Preview = (props: IProps) => {
  const classes = useStyles();
  const {
    data: {
      image,
      imageObjectURL,
      instantSale,
      lockedContent,
      name,
      salePrice,
      saleToken,
      unlockOncePurchased,
    },
  } = props;

  const renderImage = () => {
    if (!image || !imageObjectURL) return null;
    const type = getFileType(image);
    switch (type) {
      case EFileType.Image:
        return <img alt="img" className={classes.img} src={imageObjectURL} />;
      case EFileType.Video:
        return (
          <div className={classes.iconWrapper}>
            <VideocamIcon className={classes.icon} />
          </div>
        );
      case EFileType.Audio:
        return (
          <div className={classes.iconWrapper}>
            <AudiotrackIcon className={classes.icon} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>Preview</Typography>
      <div className={classes.content}>
        {renderImage()}
        <Typography className={classes.name}>{name}</Typography>
        {instantSale && (
          <Typography className={classes.price}>
            {salePrice} {saleToken}
          </Typography>
        )}
      </div>
      {unlockOncePurchased && (
        <div className={classes.unlockWrapper}>
          {lockedContent ? (
            <div
              className={classes.unlockData}
              dangerouslySetInnerHTML={{ __html: lockedContent }}
            ></div>
          ) : (
            <Typography align="center" className={classes.unlockPlaceholder}>
              Unlockable content
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};
