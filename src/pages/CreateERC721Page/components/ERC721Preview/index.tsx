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
    backgroundColor: theme.colors.background.preview,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    minHeight: theme.spacing(40),
  },
  title: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.default,
    fontWeight: "bold",
  },
  assetWrapper: {
    position: "relative",
    paddingTop: "100%",
    backgroundColor: theme.colors.background.secondary,
  },
  img: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  iconWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    marginTop: 8,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: theme.spacing(2),
    color: transparentize(0.2, theme.colors.text.default),
  },
  count: {
    fontSize: 14,
    color: transparentize(0.2, theme.colors.text.secondary),
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
      putOnSale,
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
        return (
          <div
            className={classes.img}
            style={{ backgroundImage: `url(${imageObjectURL})` }}
          ></div>
        );
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
        <div className={classes.assetWrapper}>{renderImage()}</div>
        <Typography className={classes.name}>{name}</Typography>
        <div className={classes.priceRow}>
          {instantSale && putOnSale && (
            <Typography className={classes.price}>
              {salePrice} {saleToken}
            </Typography>
          )}
          {!instantSale && putOnSale && (
            <Typography className={classes.price}>In Sale</Typography>
          )}
          {!putOnSale && (
            <Typography className={classes.price}>Not In Sale</Typography>
          )}
          <Typography className={classes.count}>1/1</Typography>
        </div>
        <Typography className={classes.count}>No Bid</Typography>
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
