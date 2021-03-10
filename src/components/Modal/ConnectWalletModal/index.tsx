import {
  CircularProgress,
  Modal,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ReactComponent as MetaMaskIcon } from "assets/svgs/metamask-color.svg";
import { ReactComponent as WalletConnectIcon } from "assets/svgs/wallet-connect.svg";
import { ConnectWalletButton } from "components/Button";
import { NETWORK_CONFIG, STORAGE_KEY_CONNECTOR } from "config/constants";
import { transparentize } from "polished";
import React, { useCallback, useEffect } from "react";
import { waitSeconds } from "utils";
import connectors from "utils/connectors";
import { ConnectorNames } from "utils/enums";
import { getLogger } from "utils/logger";

const logger = getLogger("ConnectWalletModal::Index");

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    outline: "none",
    backgroundColor: transparentize(0.1, theme.colors.text.fourth),
    minWidth: 480,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)}px 0`,
    userSelect: `none`,
  },
  title: {
    color: theme.colors.text.default,
    padding: `0 ${theme.spacing(2)}px`,
    fontSize: theme.spacing(2.5),
    marginBottom: 32,
  },
  comment: {
    color: transparentize(0.2, theme.colors.text.default),
  },
  bottom: {
    padding: `0 ${theme.spacing(2)}px`,
    textAlign: "center",
    "& > * + *": { marginTop: theme.spacing(1.5) },
  },
  connectButtons: {
    display: "flex",
    "& > * + *": {
      marginLeft: 16,
    },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const ConnectWalletModal = (props: IProps) => {
  const context = useWeb3React();
  const classes = useStyles();
  const { onClose } = props;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  useEffect(() => {
    if (activatingConnector && activatingConnector === context.connector) {
      setActivatingConnector(undefined);
      onClose();
    }
    // eslint-disable-next-line
  }, [activatingConnector, context.connector]);

  if (context.error) {
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
    context.deactivate();
    onClose();
    logger.error("Error in web3 context", context.error);
  }

  const isMetamaskEnabled = "ethereum" in window || "web3" in window;
  const onClickWallet = async (wallet: ConnectorNames) => {
    const currentConnector = connectors[wallet];
    if (wallet === ConnectorNames.Injected) {
      setActivatingConnector(currentConnector);
    }
    if (wallet === ConnectorNames.WalletConnect) {
      setActivatingConnector(currentConnector);
    }

    if (wallet) {
      if (
        currentConnector instanceof WalletConnectConnector &&
        currentConnector.walletConnectProvider?.wc?.uri
      ) {
        currentConnector.walletConnectProvider = undefined;
      }

      try {
        if (wallet === ConnectorNames.Injected) {
          // window.ethereum.request({ method: "eth_requestAccounts" });
          await window.ethereum.request(NETWORK_CONFIG);
          await waitSeconds(2);
        }
        context.activate(currentConnector);
        localStorage.setItem(STORAGE_KEY_CONNECTOR, wallet);
      } catch (error) {
        logger.error("connect::", error);
        onClickCloseButton();
      }
    }
  };

  const resetEverything = useCallback(() => {}, []);

  const onClickCloseButton = useCallback(() => {
    resetEverything(); // we need to do this or the states and functions will keep executing even when the modal is closed by the user
    onClose();
  }, [onClose, resetEverything]);

  const isConnectingToWallet = !!activatingConnector;
  let connectingText = `Connecting to wallet`;
  const connectingToMetamask = activatingConnector === connectors.injected;
  const connectingToWalletConnect =
    activatingConnector === connectors.walletconnect;
  if (connectingToMetamask) {
    connectingText = "Waiting for Approval on Metamask";
  }
  if (connectingToWalletConnect) {
    connectingText = "Opening QR for Wallet Connect";
  }

  const disableMetamask: boolean = !isMetamaskEnabled || false;
  const disableWalletConnect = false;

  return (
    <>
      <Modal
        className={classes.modal}
        disableBackdropClick={isConnectingToWallet}
        disableEnforceFocus
        onClose={onClickCloseButton}
        open={!context.account && props.visible}
      >
        <div className={classes.content}>
          <Typography align="center" className={classes.title} component="h3">
            {connectingToMetamask ? "Connecting..." : "Connect your wallet"}
          </Typography>
          <div className={classes.bottom}>
            {isConnectingToWallet ? (
              <>
                <CircularProgress />
                <Typography className={classes.comment}>
                  {connectingText}
                </Typography>
              </>
            ) : (
              <div className={classes.connectButtons}>
                <ConnectWalletButton
                  disabled={disableMetamask}
                  icon={<MetaMaskIcon />}
                  onClick={() => {
                    onClickWallet(ConnectorNames.Injected);
                  }}
                  text="Metamask"
                />
                <ConnectWalletButton
                  disabled={disableWalletConnect}
                  icon={<WalletConnectIcon />}
                  onClick={() => {
                    onClickWallet(ConnectorNames.WalletConnect);
                  }}
                  text="Wallet Connect"
                />
                <ConnectWalletButton
                  disabled={disableWalletConnect}
                  icon={<WalletConnectIcon />}
                  onClick={() => {
                    onClickWallet(ConnectorNames.WalletLink);
                  }}
                  text="Wallet Link"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
