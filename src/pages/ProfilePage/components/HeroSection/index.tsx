import {
  Avatar,
  CircularProgress,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { ReactComponent as CopyIcon } from "assets/svgs/content-copy.svg";
import { ReactComponent as FacebookIcon } from "assets/svgs/profile/facebook.svg";
import { ReactComponent as InstagramIcon } from "assets/svgs/profile/instagram.svg";
import { ReactComponent as TwitchIcon } from "assets/svgs/profile/twitch.svg";
import { ReactComponent as TwitterIcon } from "assets/svgs/profile/twitter.svg";
import { ReactComponent as TiktokIcon } from "assets/svgs/profile/youtube-gaming.svg";
import { ReactComponent as YoutubeIcon } from "assets/svgs/profile/youtube.svg";
import clsx from "clsx";
import { ProfileMarker } from "components/Marker";
import { DEFAULT_NETWORK_ID, PRICE_DECIMALS } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import copy from "copy-to-clipboard";
import { useBalances, useUserInfo } from "helpers";
import { useSnackbar } from "notistack";
import { BigNumber } from "packages/ethers";
import { transparentize } from "polished";
import React, { useState } from "react";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";
import {
  formatBigNumber,
  numberWithCommas,
  shortenAddress,
  waitSeconds,
} from "utils";
import { EProfileMarker } from "utils/enums";

const IdenticonComponent = Identicon as any;
const AVATAR_SIZE = 80;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fakeImage: {
    opacity: 0,
    position: "absolute",
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },
  imgItem: {
    height: "40vh",
    backgroundColor: theme.colors.background.eleventh,
    backgroundPositionY: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    opacity: 0,
    transition: "all 0.5s",
    position: "relative",
    "&:before": {
      content: `" "`,
      backgroundImage: theme.colors.background.gradient1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    "&.visible": {
      opacity: 0.5,
    },
  },
  mainContent: {
    opacity: 0,
    transition: "all 0.5s",
    "&.visible": {
      opacity: 1,
    },
  },
  title: {
    position: "absolute",
    left: theme.spacing(2),
    top: theme.spacing(4),
    color: theme.colors.text.default,
    fontSize: 13,
  },
  comments: {
    position: "absolute",
    left: theme.spacing(3),
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    fontSize: 32,
    color: theme.colors.text.default,
    fontWeight: "bold",
    marginRight: theme.spacing(3.5),
  },
  description: {
    fontSize: theme.spacing(2),
    lineHeight: 1.5,
    color: transparentize(0.4, theme.colors.text.default),
    maxWidth: 500,
  },
  row: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginRight: theme.spacing(3),
    borderRadius: "50%",
    overflow: "hidden",
    border: `1px solid ${transparentize(0.8, theme.colors.text.default)}`,
  },
  editProfileNav: {
    display: "inline-flex",
    height: theme.spacing(5.5),
    minWidth: "auto",
    marginTop: theme.spacing(3),
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
  },
  balanceLabel: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.sixth,
    maxWidth: 500,
  },
  balanceUSD: {
    fontSize: theme.spacing(4.5),
    color: theme.colors.text.default,
    maxWidth: 500,
  },
  balanceGSWAP: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.sixth,
    maxWidth: 500,
  },
  arrowUp: {
    width: theme.spacing(3.5),
    color: theme.colors.text.arrowUp,
  },
  copyButton: {
    marginLeft: 8,
    cursor: "pointer",
    color: transparentize(0.4, theme.colors.text.default),
    transition: "all 0.4s",
    "&:hover": {
      color: theme.colors.text.default,
    },
  },
  loadWrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    top: 24,
    bottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  socialLink: {
    color: theme.colors.text.default,
    textDecoration: "none",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
    "& + &": {
      marginLeft: 12,
    },
  },
}));

interface IProps {
  className?: string;
  userId: string;
}

interface IState {
  imageLoaded: boolean;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const context = useConnectedWeb3Context();
  const { enqueueSnackbar } = useSnackbar();
  const { account, networkId } = context;
  const [state, setState] = useState<IState>({ imageLoaded: false });
  const { userId } = props;
  const { userInfo } = useUserInfo(userId);

  const isMine = account?.toLowerCase() === userId.toLowerCase();

  const setImageLoaded = (imageLoaded: boolean) =>
    setState((prev) => ({ ...prev, imageLoaded }));

  const gSwapToken = getToken(networkId || DEFAULT_NETWORK_ID, "gswap");
  const {
    balances: {
      erc20Balances: { gswap: gswapBalance },
    },
  } = useBalances(context);
  const {
    data: {
      price: {
        gswap: { price },
      },
    },
  } = useGlobal();
  const formattedGswapBalance = numberWithCommas(
    formatBigNumber(gswapBalance, gSwapToken.decimals)
  );

  const usdBalance = BigNumber.from(gswapBalance).mul(price);
  const formattedUsdBalance = numberWithCommas(
    formatBigNumber(usdBalance, gSwapToken.decimals + PRICE_DECIMALS)
  );

  const onCopy = () => {
    copy(account || "");
    enqueueSnackbar("Address is copied");
  };

  const headerBgVisible =
    state.imageLoaded || (userInfo && !userInfo.headerImageUrl);

  return (
    <div className={clsx(classes.root, props.className)}>
      {!headerBgVisible && (
        <div className={classes.loadWrapper}>
          <CircularProgress size={40} />
        </div>
      )}
      {userInfo && userInfo.headerImageUrl && (
        <img
          alt="fake"
          className={classes.fakeImage}
          onLoad={async () => {
            await waitSeconds(3);
            setImageLoaded(true);
          }}
          src={userInfo?.headerImageUrl}
        />
      )}
      <div
        className={clsx(classes.imgItem, headerBgVisible ? "visible" : "")}
        style={{
          backgroundImage: state.imageLoaded
            ? `url(${userInfo?.headerImageUrl})`
            : "",
        }}
      />
      <div
        className={clsx(classes.mainContent, headerBgVisible ? "visible" : "")}
      >
        <Typography className={classes.title} component="div">
          {isMine ? "MY ACCOUNT" : "User Info"}
        </Typography>
        <div className={classes.comments}>
          <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
              <div className={classes.row}>
                {userInfo && userInfo.imageUrl ? (
                  <Avatar className={classes.avatar} src={userInfo.imageUrl} />
                ) : (
                  <div className={classes.avatar}>
                    <IdenticonComponent
                      bg="#fff"
                      size={AVATAR_SIZE}
                      string={account || ""}
                    />
                  </div>
                )}

                <div>
                  <div className={classes.row}>
                    <Typography className={classes.name} component="div">
                      {userInfo && userInfo.name ? userInfo.name : "    "}
                    </Typography>
                    {userInfo && userInfo.twitterUsername && (
                      <ProfileMarker marker={EProfileMarker.Verified} />
                    )}
                  </div>
                  <div className={classes.row}>
                    <Typography className={classes.description} component="div">
                      {shortenAddress(account || "")}
                    </Typography>
                    <span className={classes.copyButton} onClick={onCopy}>
                      <CopyIcon />
                    </span>
                  </div>
                  {userInfo && (
                    <div className={classes.row}>
                      {userInfo.twitterUsername && (
                        <a
                          className={classes.socialLink}
                          href={`https://twitter.com/${userInfo.twitterUsername}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <TwitterIcon />
                        </a>
                      )}
                      {userInfo.twitchUsername && (
                        <a
                          className={classes.socialLink}
                          href={`https://www.twitch.tv/${userInfo.twitchUsername}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <TwitchIcon />
                        </a>
                      )}
                      {userInfo.facebookUsername && (
                        <a
                          className={classes.socialLink}
                          href={`https://www.facebook.com/${userInfo.facebookUsername}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <FacebookIcon />
                        </a>
                      )}
                      {userInfo.youtubeUsername && (
                        <a
                          className={classes.socialLink}
                          href={`https://www.youtube.com/c/${userInfo.youtubeUsername}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <YoutubeIcon />
                        </a>
                      )}
                      {userInfo.instagramUsername && (
                        <a
                          className={classes.socialLink}
                          href={`https://www.instagram.com/${userInfo.instagramUsername}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <InstagramIcon />
                        </a>
                      )}
                      {userInfo.tiktokUsername && (
                        <a
                          className={classes.socialLink}
                          href={`https://www.tiktok.com/@${userInfo.tiktokUsername}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <TiktokIcon />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {isMine && (
                <NavLink
                  className={clsx(
                    commonClasses.transparentButton,
                    classes.editProfileNav
                  )}
                  to="/settings"
                >
                  EDIT PROFILE
                </NavLink>
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              {isMine ? (
                <div>
                  <Typography className={classes.balanceLabel} component="div">
                    BALANCE
                  </Typography>
                  <div className={classes.row}>
                    <Typography className={classes.balanceUSD} component="div">
                      $ {formattedUsdBalance}
                    </Typography>
                    <ArrowUpwardIcon className={classes.arrowUp} />
                  </div>
                  <Typography className={classes.balanceGSWAP} component="div">
                    {formattedGswapBalance} {gSwapToken.symbol}
                  </Typography>
                </div>
              ) : (
                <div></div>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
