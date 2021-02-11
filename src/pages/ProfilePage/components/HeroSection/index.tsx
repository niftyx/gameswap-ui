import {
  Avatar,
  Button,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import clsx from "classnames";
import { ProfileMarker } from "components/Marker";
import { DEFAULT_NETWORK_ID, PRICE_DECIMALS } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { useBalances } from "helpers";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { formatBigNumber, numberWithCommas } from "utils";
import { EProfileMarker } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  imgItem: {
    height: "50vh",
    backgroundPositionY: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    opacity: 0.3,
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
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    fontSize: 70,
    color: theme.colors.text.default,
    fontWeight: "bold",
    marginRight: theme.spacing(3.5),
  },
  description: {
    fontSize: theme.spacing(2),
    lineHeight: "36px",
    color: transparentize(0.4, theme.colors.text.default),
    maxWidth: 500,
  },
  row: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(13),
    height: theme.spacing(13),
    marginRight: theme.spacing(3),
  },
  button: {
    height: theme.spacing(5.5),
    minWidth: "auto",
    marginTop: theme.spacing(3),
  },
  balanceLabel: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.sixth,
    maxWidth: 500,
  },
  balanceUSD: {
    fontSize: theme.spacing(5.5),
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
}));

interface IProps {
  className?: string;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const context = useConnectedWeb3Context();
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
    },
  } = useGlobal();
  const formattedGswapBalance = numberWithCommas(
    formatBigNumber(gswapBalance, gSwapToken.decimals)
  );

  const usdBalance = BigNumber.from(gswapBalance).mul(price);
  const formattedUsdBalance = numberWithCommas(
    formatBigNumber(usdBalance, gSwapToken.decimals + PRICE_DECIMALS)
  );

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
              <Avatar className={classes.avatar} src="/svgs/mock/avatar.svg" />
              <div>
                <div className={classes.row}>
                  <Typography className={classes.name} component="div">
                    Elon Must
                  </Typography>
                  <ProfileMarker marker={EProfileMarker.ProTrader} />
                </div>
                <Typography className={classes.description} component="div">
                  {account || ""}
                </Typography>
              </div>
            </div>
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
              <Button
                className={clsx(
                  commonClasses.transparentButton,
                  classes.button
                )}
                variant="contained"
              >
                BUY GSWAP
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
