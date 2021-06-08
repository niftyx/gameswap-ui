import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ConnectWalletModal, LoadingScreen } from "components";
import { STORAGE_KEY_CONNECTOR } from "config/constants";
import { useGlobal } from "contexts/GlobalContext";
import { useIsMountedRef } from "hooks";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAPIService } from "services/api";
import { getAuthService } from "services/authApi";
import { waitSeconds } from "utils";
import { signMessage } from "utils/auth";
import connectors from "utils/connectors";
import { ConnectorNames } from "utils/enums";
import { IAuthToken, IUserInfo, Maybe } from "utils/types";
export interface ConnectedWeb3Context {
  account: Maybe<string> | null;
  library: Web3Provider | undefined;
  networkId: number | undefined;
  rawWeb3Context: any;
  initialized: boolean;
  walletConnectModalOpened: boolean;
  setWalletConnectModalOpened: (_: boolean) => void;
  fetchAuthToken: () => Promise<void>;
}

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
    deactivate,
    error,
    library,
  } = context;
  const { updateUserInfo } = useGlobal();
  const [state, setState] = useState<{
    initialized: boolean;
    walletConnectModalOpened: boolean;
    authToken?: IAuthToken;
  }>({
    initialized: false,
    walletConnectModalOpened: false,
  });

  const isMountedRef = useIsMountedRef();

  const history = useHistory();
  const nextPath = new URLSearchParams(history.location.search).get("next");

  const apiService = getAPIService();
  const authService = getAuthService(chainId);

  const setInitialized = (initialized: boolean) => {
    setState((prev) => ({ ...prev, initialized }));
  };
  const setWalletConnectModalOpened = (walletConnectModalOpened: boolean) =>
    setState((prev) => ({ ...prev, walletConnectModalOpened }));

  const updateInitialized = () => {
    if (!state.initialized) {
      setInitialized(true);
    }
  };

  const getJwtToken = async (message?: string) => {
    if (!library || !account) return;

    const finalMessage = message || "I am going to edit";
    const signedMessage = await signMessage(finalMessage, library);
    const response = await authService.connect(finalMessage, signedMessage);
    setState((prev) => ({ ...prev, authToken: response }));
    await waitSeconds(0.1);
  };

  const clearJwtToken = async () => {
    setState((prev) => ({ ...prev, authToken: undefined }));
    await waitSeconds(0.1);
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
          .then(async () => {
            await waitSeconds(0.1);
            updateInitialized();
          })
          .catch(() => {
            updateInitialized();
          });
      }
    } else {
      updateInitialized();
    }
    // eslint-disable-next-line
  }, [context, library, active, error]);

  useEffect(() => {
    const checkNextPath = (userInfo?: IUserInfo) => {
      if (nextPath) {
        const lNextPath = nextPath.toLowerCase();
        const customUrl =
          userInfo && userInfo.customUrl ? userInfo.customUrl : "";
        if (lNextPath.includes("/users/next/")) {
          const replacePath = customUrl
            ? lNextPath.replace("/users/next", `/${customUrl}`)
            : lNextPath.replace("/next/", `/${account}/`);
          history.push(replacePath);
        }
      }
    };

    const loadUserInfo = async () => {
      if (!account) {
        updateUserInfo();
        checkNextPath();
        return;
      }
      const userInfo = await apiService.getAccountInfo(account);
      if (isMountedRef.current === true) {
        updateUserInfo(userInfo);
        checkNextPath(userInfo);
      }
    };
    loadUserInfo();

    const loadAuthToken = async () => {
      try {
        if (account) {
          getJwtToken();
        } else {
          clearJwtToken();
        }
      } catch (error) {
        console.warn(error);
      }
    };

    loadAuthToken();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const value = {
    account: account || null,
    library,
    networkId: chainId,
    rawWeb3Context: context,
    initialized: state.initialized,
    walletConnectModalOpened: state.walletConnectModalOpened,
    setWalletConnectModalOpened,
    fetchAuthToken: getJwtToken,
  };

  return (
    <ConnectedWeb3Context.Provider value={value}>
      {state.initialized ? props.children : <LoadingScreen fullScreen />}
      {state.walletConnectModalOpened && (
        <ConnectWalletModal
          onClose={() => setWalletConnectModalOpened(false)}
          visible={state.walletConnectModalOpened}
        />
      )}
    </ConnectedWeb3Context.Provider>
  );
};

export const WhenConnected: React.FC = (props) => {
  const { account } = useConnectedWeb3Context();

  return <>{account && props.children}</>;
};
