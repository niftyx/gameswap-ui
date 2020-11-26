import { supportedNetworkIds } from "config/networks";
import { Connectors } from "web3-react";

const { InjectedConnector } = Connectors;

const MetaMask = new InjectedConnector({
  supportedNetworks: supportedNetworkIds,
});

export default {
  MetaMask,
};
