import { Avatar, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as TickIcon } from "assets/svgs/yellow-tick.svg";
import { transparentize } from "polished";
import React from "react";
import Identicon from "react-identicons";
import { shortenAddress } from "utils";

const IdenticonComponent = Identicon as any;

const AVATAR_SIZE = 50;
const tickerWidth = 16;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "16px 0",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  left: {
    marginRight: 16,
    borderRadius: "50%",
    overflow: "hidden",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  content: {
    flex: 1,
  },
  role: {
    color: transparentize(0.4, theme.colors.text.default),
  },
  name: {
    color: theme.colors.text.default,
  },
  tick: {
    position: "absolute",
    zIndex: 1,
    bottom: 16,
    left: AVATAR_SIZE - tickerWidth,
  },
}));

interface IProps {
  roleName: string;
  image?: string;
  address?: string;
  name?: string;
  showTick?: boolean;
}

export const OwnerAvatarRowItem = (props: IProps) => {
  const classes = useStyles();
  const {
    address = "",
    image = "",
    name = "",
    roleName,
    showTick = true,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        {image && (
          <Avatar alt="avatar" className={classes.avatar} src={image} />
        )}
        {!image && (
          <IdenticonComponent
            bg="#02D290"
            size={AVATAR_SIZE}
            string={address}
          />
        )}
      </div>
      {showTick && <TickIcon className={classes.tick} />}
      <div className={classes.content}>
        <Typography className={classes.role}>{roleName}</Typography>
        <Typography className={classes.name}>
          {name ? name : shortenAddress(address)}
        </Typography>
      </div>
    </div>
  );
};
