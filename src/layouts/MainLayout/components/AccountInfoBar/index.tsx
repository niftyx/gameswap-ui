import {
  Button,
  Hidden,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SendIcon from "@material-ui/icons/Send";
import { ReactComponent as MetaMaskIcon } from "assets/svgs/metamask.svg";
import clsx from "clsx";
import { ConnectWalletModal } from "components";
import {
  DEFAULT_NETWORK_ID,
  STORAGE_KEY_CONNECTOR,
  TokenAvax,
} from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { useBalances } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";

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
    backgroundColor: theme.colors.background.fourth,
    height: theme.custom.appHeaderItemHeight,
    display: "flex",
    justifyContent: "center",
    textDecoration: "none",
    alignItems: "center",
    color: theme.colors.text.default,
    [theme.breakpoints.down(1350)]: {
      display: "none",
    },
  },
  label: {
    fontSize: theme.spacing(1.25),
    lineHeight: `${theme.spacing(1.75)}px`,
    color: transparentize(0.3, theme.colors.text.default),
  },
  eth: {
    padding: 3,
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.background.primary,
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
    color: transparentize(0.18, theme.colors.text.default),
  },
  ethAddress: {
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.default,
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
    backgroundColor: theme.colors.background.primary,
    height: theme.custom.appHeaderItemHeight,
    width: theme.custom.appHeaderItemHeight,
    "& svg": {
      height: Number(theme.custom.appHeaderItemHeight) / 2,
      width: Number(theme.custom.appHeaderItemHeight) / 2,
      color: theme.colors.text.default,
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
}));

interface IProps {
  className?: string;
}

const AccountInfoBar = (props: IProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const context = useConnectedWeb3Context();
  const {
    account,
    library: provider,
    networkId,
    rawWeb3Context,
    setWalletConnectModalOpened,
  } = context;
  const {
    balances: {
      erc20Balances: { gswap: gswapBalance },
      eth: ethBalance,
    },
  } = useBalances(context);
  const formattedEthBalance = formatBigNumber(ethBalance, TokenAvax.decimals);
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
    history.push("/profile");
  };

  const isConnected = !!account;

  const onConnect = () => {
    setWalletConnectModalOpened(true);
  };
  const onDisconnect = () => {
    handleClose();
    rawWeb3Context.deactivate();
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
    setWalletConnectModalOpened(false);
  };

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
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            elevation={0}
            getContentAnchorEl={null}
            id="more-menu"
            keepMounted
            onClose={handleClose}
            open={Boolean(anchorEl)}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem onClick={onDisconnect}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Disconnect" />
            </MenuItem>
          </Menu>
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
