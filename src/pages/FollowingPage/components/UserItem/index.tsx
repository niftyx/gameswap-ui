import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as TickIcon } from "assets/svgs/blue-tick.svg";
import { ReactComponent as CopyIcon } from "assets/svgs/copy.svg";
import copy from "copy-to-clipboard";
import React from "react";
import { shortenAddress } from "utils";

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", alignItems: "center" },
  avatar: { width: 70, height: 70, marginRight: 24, borderRadius: "50%" },
  content: { flex: 1 },
  nameWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
  },
  name: { wordBreak: "break-all", fontWeight: 700, color: theme.colors.white },
  infoWrapper: {
    display: "flex",
    alignItems: "center",
  },
  info: {
    fontSize: 14,
    color: theme.colors.primary40,
    display: "flex",
    alignItems: "center",
  },
  checked: { marginLeft: 16, color: theme.colors.lime, width: 16, height: 16 },
}));

interface IProps {
  verified?: boolean;
}

export const UserItem = (props: IProps) => {
  const classes = useStyles();
  const verified = props.verified || false;

  return (
    <div className={classes.root}>
      <img
        alt="avatar"
        className={classes.avatar}
        src="/images/mock/user1.png"
      />
      <div className={classes.content}>
        <div className={classes.nameWrapper}>
          <Typography className={classes.name}>Shroomie Designer</Typography>
          {verified && <TickIcon className={classes.checked} />}
        </div>
        <div className={classes.infoWrapper}>
          <Typography className={classes.info}>
            <img alt="heart" src="/svgs/icons/user-heart.svg" />
            57.2K
          </Typography>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Typography className={classes.info}>
            {shortenAddress("0x2e84741f27e2993D637f3a537191101ccBF67050")}
            &nbsp;
            <CopyIcon
              onClick={() => {
                copy("0x2e84741f27e2993D637f3a537191101ccBF67050");
              }}
            />
          </Typography>
        </div>
      </div>
    </div>
  );
};
