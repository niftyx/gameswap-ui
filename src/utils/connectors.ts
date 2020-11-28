import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { supportedNetworkIds, supportedNetworkURLs } from "config/networks";

const POLLING_INTERVAL = 12000;

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworkIds,
});

const walletconnect = new WalletConnectConnector({
  rpc: { 1: supportedNetworkURLs[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export default {
  injected,
  walletconnect,
};
