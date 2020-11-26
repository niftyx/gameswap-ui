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
import { STORAGE_KEY_CONNECTOR } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { useHistory } from "react-router-dom";
import { shortenAddress } from "utils";

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
  const { account, rawWeb3Context } = useConnectedWeb3Context();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget as any);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toProfile = () => {
    history.push("/profile");
  };

  const isConnected = !!account;

  const onConnect = () => {
    if (window.ethereum) {
      rawWeb3Context.setConnector("MetaMask");
      localStorage.setItem(STORAGE_KEY_CONNECTOR, "MetaMask");
    }
  };
  const onDisconnect = () => {
    rawWeb3Context.unsetConnector();
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {isConnected ? (
        <>
          <div className={classes.gswap}>
            <Typography className={classes.label} component="div">
              GSWAP
            </Typography>
            <Typography className={classes.gswapValue} component="div">
              240.60
            </Typography>
          </div>
          <div className={classes.eth}>
            <div className={classes.ethBalance}>
              <Typography className={classes.label} component="div">
                ETH
              </Typography>
              <Typography className={classes.ethValue} component="div">
                52.3011
              </Typography>
            </div>
            <div className={classes.ethAddress} onClick={toProfile}>
              <Typography component="div">
                {shortenAddress("0x18B13ef88822292E59bfF80210D815F7FBFC9b32")}
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
            <MenuItem>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Test" />
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
