import { Avatar, Grid, Typography, makeStyles } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { ReactComponent as CopyIcon } from "assets/svgs/content-copy.svg";
import clsx from "clsx";
import { ProfileMarker } from "components/Marker";
import { DEFAULT_NETWORK_ID, PRICE_DECIMALS } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import copy from "copy-to-clipboard";
import { BigNumber } from "ethers";
import { useBalances } from "helpers";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React from "react";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";
import { formatBigNumber, numberWithCommas, shortenAddress } from "utils";
import { EProfileMarker } from "utils/enums";

const IdenticonComponent = Identicon as any;
const AVATAR_SIZE = 80;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  imgItem: {
    height: "50vh",
    backgroundPositionY: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    opacity: 0.3,
    position: "relative",
    "&:before": {
      content: `" "`,
      backgroundImage:
        "linear-gradient(160deg, rgba(58, 62, 69, 0) 11%, black 82%)",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
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
    left: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(4),
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
}));

interface IProps {
  className?: string;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const context = useConnectedWeb3Context();
  const { enqueueSnackbar } = useSnackbar();
  const { account, networkId } = context;
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
      userInfo,
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

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={classes.imgItem}
        style={{
          backgroundImage: `url("/images/backgrounds/profile.png")`,
        }}
      />
      <Typography className={classes.title} component="div">
        MY ACCOUNT
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
              </div>
            </div>
            <NavLink
              className={clsx(
                commonClasses.transparentButton,
                classes.editProfileNav
              )}
              to="/settings"
            >
              EDIT PROFILE
            </NavLink>
          </Grid>
          <Grid item md={4} xs={12}>
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
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
