import {
  Button,
  IconButton,
  Popover,
  Typography,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { ReactComponent as MetaMaskIcon } from "assets/svgs/metamask.svg";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useBalances } from "helpers";
import { transparentize } from "polished";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";

import { AccountPopoverContent } from "../AccountPopoverContent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(1.5),
    },
  },
  create: {
    padding: `0 10px 0 6px`,
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.primary60,
    height: theme.custom.appHeaderItemHeight,
    display: "flex",
    justifyContent: "center",
    textDecoration: "none",
    alignItems: "center",
    color: theme.colors.white,
    [theme.breakpoints.down(1350)]: {
      display: "none",
    },
  },
  label: {
    fontSize: theme.spacing(1.25),
    lineHeight: `${theme.spacing(1.75)}px`,
    color: transparentize(0.3, theme.colors.white),
  },
  eth: {
    padding: 3,
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.primary100,
    height: theme.custom.appHeaderItemHeight,
    display: "flex",
    alignItems: "center",
  },
  ethBalance: {
    padding: "4px 10px",
  },
  ethValue: {
    fontSize: theme.spacing(2),
    lineHeight: `${theme.spacing(3)}px`,
    color: transparentize(0.18, theme.colors.white),
  },
  ethAddress: {
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.primary70,
    color: theme.colors.white,
    height: "100%",
    padding: `0 ${theme.spacing(1.5)}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s",
    "&:hover": {
      opacity: 0.6,
    },
  },
  moreButton: {
    borderRadius: 6,
    backgroundColor: theme.colors.primary100,
    height: theme.custom.appHeaderItemHeight,
    width: theme.custom.appHeaderItemHeight,
    "& svg": {
      height: Number(theme.custom.appHeaderItemHeight) / 2,
      width: Number(theme.custom.appHeaderItemHeight) / 2,
      color: theme.colors.white,
    },
  },
  connectButton: {
    height: theme.spacing(5),
    borderRadius: theme.spacing(0.5),
    "& svg": {
      height: theme.spacing(3),
      width: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
    "& .button_connect__label": {
      marginTop: 1,
    },
  },
  popover: {
    marginTop: 8,
  },
  popoverContent: {
    borderRadius: 8,
    border: `1px solid ${transparentize(0.8, theme.colors.white)}`,
  },
}));

interface IProps {
  className?: string;
}

const AccountInfoBar = (props: IProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const context = useConnectedWeb3Context();
  const { account, networkId, setWalletConnectModalOpened } = context;
  const {
    data: { userInfo },
  } = useGlobal();
  const {
    balances: {
      erc20Balances: { gswap: gswapBalance },
    },
  } = useBalances(context);
  const gSwapToken = getToken(networkId || DEFAULT_NETWORK_ID, "gswap");

  const formattedGswapBalance = formatToShortNumber(
    formatBigNumber(gswapBalance, gSwapToken.decimals)
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(() => event.currentTarget as any);
  };

  const handleClose = () => {
    setAnchorEl(() => null);
  };

  const toProfile = () => {
    if (userInfo && userInfo.customUrl) {
      history.push(`/${userInfo.customUrl}`);
    } else {
      history.push(`/users/${account}`);
    }
  };

  const isConnected = !!account;

  const onConnect = () => {
    setWalletConnectModalOpened(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "account-info-popover" : undefined;

  return (
    <div className={clsx(classes.root, props.className)}>
      {isConnected ? (
        <>
          <NavLink className={classes.create} to="/create">
            <AddIcon />
            &nbsp;CREATE
          </NavLink>

          <div className={classes.eth}>
            <div className={classes.ethBalance}>
              <Typography className={classes.label} component="div">
                {gSwapToken.symbol}
              </Typography>
              <Typography className={classes.ethValue} component="div">
                {formattedGswapBalance}
              </Typography>
            </div>
            <div className={classes.ethAddress} onClick={toProfile}>
              <Typography component="div">
                {shortenAddress(account || "")}
              </Typography>
            </div>
          </div>
          <IconButton className={classes.moreButton} onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            className={classes.popover}
            classes={{
              paper: classes.popoverContent,
            }}
            id={id}
            onClose={handleClose}
            open={open}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <AccountPopoverContent onClose={handleClose} />
          </Popover>
        </>
      ) : (
        <Button
          className={classes.connectButton}
          color="primary"
          onClick={onConnect}
          variant="contained"
        >
          <MetaMaskIcon />
          <span className="button_connect__label">CONNECT WALLET</span>
        </Button>
      )}
    </div>
  );
};

export default AccountInfoBar;
