import { ContractWrappers } from "@0x/contract-wrappers";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { STORAGE_KEY_CONNECTOR } from "config/constants";
import React, { useEffect, useMemo, useState } from "react";
import connectors from "utils/connectors";
import { ConnectorNames } from "utils/enums";
import { Maybe } from "utils/types";
export interface ConnectedWeb3Context {
  account: Maybe<string> | null;
  library: Web3Provider | undefined;
  networkId: number | undefined;
  rawWeb3Context: any;
  initialized: boolean;
  web3Wrapper: Web3Wrapper | null;
  contractWrappers: ContractWrappers | null;
}

let web3Wrapper: Web3Wrapper | null = null;
let contractWrappers: ContractWrappers | null = null;

const ConnectedWeb3Context = React.createContext<Maybe<ConnectedWeb3Context>>(
  null
);

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC = (props) => {
  const context = useWeb3React<Web3Provider>();
  const {
    account,
    activate,
    active,
    chainId,
    connector,
    deactivate,
    error,
    library,
  } = context;
  const [initialized, setInitialized] = useState<boolean>(false);

  const updateInitialized = () => {
    if (!initialized) setInitialized(true);
  };

  useEffect(() => {
    const connector = localStorage.getItem(STORAGE_KEY_CONNECTOR);
    if (error) {
      localStorage.removeItem(STORAGE_KEY_CONNECTOR);
      deactivate();
      updateInitialized();
    } else if (connector && Object.keys(connectors).includes(connector)) {
      if (!active) {
        activate(connectors[connector as ConnectorNames])
          .then(() => updateInitialized())
          .catch(() => updateInitialized());
      }
    } else {
      updateInitialized();
    }
    // eslint-disable-next-line
  }, [context, library, active, error]);

  const xWrappers: {
    web3Wrapper: Web3Wrapper | null;
    contractWrappers: ContractWrappers | null;
  } = useMemo(() => {
    if (!library) {
      web3Wrapper = null;
      contractWrappers = null;
    } else {
      web3Wrapper = new Web3Wrapper(library);
      contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), {
        chainId: chainId || 1,
      });
    }
    return { web3Wrapper, contractWrappers };
  }, [library]);

  const value = {
    account: account || null,
    library,
    networkId: chainId,
    rawWeb3Context: context,
    initialized,
    ...xWrappers,
  };

  return (
    <ConnectedWeb3Context.Provider value={value}>
      {props.children}
    </ConnectedWeb3Context.Provider>
  );
};

export const WhenConnected: React.FC = (props) => {
  const { account } = useConnectedWeb3Context();

  return <>{account && props.children}</>;
};
