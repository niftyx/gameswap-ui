import { Avatar, Typography, makeStyles } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import Identicon from "react-identicons";
import { shortenAddress } from "utils";

const IdenticonComponent = Identicon as any;

const avatarSize = 50;
const tickerWidth = 16;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "16px 0",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  avatar: { width: avatarSize, height: avatarSize },
  left: {
    marginRight: 16,
    borderRadius: "50%",
    overflow: "hidden",
    width: avatarSize,
    height: avatarSize,
  },
  content: {
    flex: 1,
  },
  role: {
    color: transparentize(0.4, theme.colors.text.default),
    "& span": {
      color: theme.colors.text.default,
    },
  },
  name: {
    color: transparentize(0.4, theme.colors.text.default),
    "& span": {
      color: theme.colors.text.default,
    },
  },
}));

interface IProps {
  comment1: string;
  tokenPrice: string;
  usdPrice: string;
  image?: string;
  address?: string;
  name?: string;
}

export const BidderAvatarRowItem = (props: IProps) => {
  const classes = useStyles();
  const { address = "", comment1, image, name, tokenPrice, usdPrice } = props;

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        {image && (
          <Avatar alt="avatar" className={classes.avatar} src={image} />
        )}
        {!image && (
          <IdenticonComponent bg="#fff" size={avatarSize} string={address} />
        )}
      </div>

      <div className={classes.content}>
        <Typography className={classes.role}>
          {comment1} <span>{name ? name : shortenAddress(address)}</span>
        </Typography>
        <Typography className={classes.name}>
          <span>{tokenPrice}</span> {usdPrice}
        </Typography>
      </div>
    </div>
  );
};