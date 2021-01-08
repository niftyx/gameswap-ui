import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SendIcon from "@material-ui/icons/Send";
import { ReactComponent as MetaMaskIcon } from "assets/svgs/metamask.svg";
import clsx from "classnames";
import { ConnectWalletModal } from "components";
import { STORAGE_KEY_CONNECTOR, TokenEthereum } from "config/constants";
import { getToken } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useEthBalance, useGSwapBalance } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { formatBigNumber, formatToShortNumber, shortenAddress } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(1.5),
    },
  },
  gswap: {
    padding: `0 10.5px`,
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.background.third,
    height: theme.custom.appHeaderItemHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: theme.spacing(1.25),
    lineHeight: `${theme.spacing(1.75)}px`,
    color: transparentize(0.63, theme.colors.text.default),
  },
  gswapValue: {
    fontSize: theme.spacing(2.5),
    lineHeight: `${theme.spacing(3.375)}px`,
    color: theme.colors.text.default,
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
    fontSize: theme.spacing(2.5),
    lineHeight: `${theme.spacing(3.375)}px`,
    color: transparentize(0.18, theme.colors.text.default),
  },
  ethAddress: {
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.colors.background.secondary,
    height: "100%",
    padding: `0 ${theme.spacing(2)}px`,
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
    borderRadius: theme.spacing(1),
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
    height: theme.spacing(6.5),
    borderRadius: theme.spacing(0.5),
    "& svg": {
      height: theme.spacing(3.25),
      width: theme.spacing(3.65),
      marginRight: theme.spacing(2),
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
  const [isModalOpen, setModalState] = useState<boolean>(false);
  const context = useConnectedWeb3Context();
  const { account, library: provider, networkId, rawWeb3Context } = context;
  const { balance: ethBalance } = useEthBalance(provider, account || "");
  const formattedEthBalance = formatBigNumber(
    ethBalance,
    TokenEthereum.decimals
  );
  const gSwapToken = getToken(networkId || 1, "gswap");
  const { balance: gswapBalance } = useGSwapBalance(context);
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
    setModalState(true);
  };
  const onDisconnect = () => {
    handleClose();
    rawWeb3Context.deactivate();
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
    setModalState(false);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {isConnected ? (
        <>
          <div className={classes.gswap}>
            <Typography className={classes.label} component="div">
              {gSwapToken.symbol}
            </Typography>
            <Typography className={classes.gswapValue} component="div">
              {formattedGswapBalance}
            </Typography>
          </div>
          <div className={classes.eth}>
            <div className={classes.ethBalance}>
              <Typography className={classes.label} component="div">
                {TokenEthereum.symbol}
              </Typography>
              <Typography className={classes.ethValue} component="div">
                {formattedEthBalance}
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
      <ConnectWalletModal
        onClose={() => setModalState(false)}
        visible={isModalOpen}
      />
    </div>
  );
};

export default AccountInfoBar;
