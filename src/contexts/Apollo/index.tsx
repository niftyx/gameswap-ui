import { ApolloProvider } from "@apollo/react-hooks";
import { getApolloClient } from "apolloClientConfig";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import React from "react";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const ApolloProviderWrapper = (props: IProps) => {
  const { networkId } = useConnectedWeb3Context();
  const client = React.useMemo(
    () => getApolloClient(networkId || DEFAULT_NETWORK_ID),
    [networkId]
  );

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
