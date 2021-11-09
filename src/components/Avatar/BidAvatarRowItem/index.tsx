import { Avatar, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import { shortenAddress } from "utils";

const IdenticonComponent = Identicon as any;

const AVATAR_SIZE = 32;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "16px 0",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  left: {
    marginRight: 24,
    borderRadius: "50%",
    overflow: "hidden",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  content: {
    flex: 1,
  },
  role: {
    fontSize: 14,
    color: transparentize(0.4, theme.colors.white),
    "& span": {
      color: theme.colors.white,
    },
  },
  name: {
    fontSize: 14,
    color: transparentize(0.4, theme.colors.white),
    "& span": {
      color: theme.colors.white,
    },
    "& a": {
      color: theme.colors.white,
      textDecoration: "none",
    },
  },
}));

interface IProps {
  comment1: string;
  tokenPrice: string;
  image?: string;
  address?: string;
  name?: string;
  href?: string;
  className?: string;
}

export const BidAvatarRowItem = (props: IProps) => {
  const classes = useStyles();
  const { address = "", comment1, href, image, name, tokenPrice } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.left}>
        {image && (
          <Avatar alt="avatar" className={classes.avatar} src={image} />
        )}
        {!image && (
          <IdenticonComponent bg="#fff" size={AVATAR_SIZE} string={address} />
        )}
      </div>

      <div className={classes.content}>
        <Typography className={classes.role}>
          <span>{tokenPrice}</span>
        </Typography>
        <Typography className={classes.name}>
          {comment1}{" "}
          {href ? (
            <NavLink to={href}>{name ? name : shortenAddress(address)}</NavLink>
          ) : (
            <span>{name ? name : shortenAddress(address)}</span>
          )}
        </Typography>
      </div>
    </div>
  );
};
