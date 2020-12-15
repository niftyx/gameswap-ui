import { ApolloProvider } from "@apollo/react-hooks";
import { getApolloClient } from "apolloClientConfig";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import React from "react";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const ApolloProviderWrapper = (props: IProps) => {
  const { networkId } = useConnectedWeb3Context();
  const client = React.useMemo(() => getApolloClient(networkId || 1), [
    networkId,
  ]);

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
