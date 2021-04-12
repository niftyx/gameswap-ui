import { Avatar, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as TickIcon } from "assets/svgs/blue-tick.svg";
import clsx from "clsx";
import React from "react";
import Identicon from "react-identicons";
import { shortenAddress } from "utils";

const IdenticonComponent = Identicon as any;

const AVATAR_SIZE = 50;
const tickerWidth = 24;

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
    color: theme.colors.text.sixth,
  },
  name: {
    color: theme.colors.text.default,
  },
  tick: {
    position: "absolute",
    zIndex: 1,
    bottom: 16,
    left: AVATAR_SIZE - tickerWidth / 2,
    width: tickerWidth,
    height: tickerWidth,
  },
}));

interface IProps {
  roleName: string;
  image?: string;
  address?: string;
  name?: string;
  showTick?: boolean;
  right?: () => React.ReactNode;
  className?: string;
}

export const OwnerAvatarRowItem = (props: IProps) => {
  const classes = useStyles();
  const {
    address = "",
    image = "",
    name = "",
    right,
    roleName,
    showTick = true,
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
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
      {right && right()}
    </div>
  );
};
