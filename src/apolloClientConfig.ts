import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import apolloLogger from "apollo-link-logger";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { getGraphUris } from "./config/networks";

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const getLink = (httpLink: any, wsLink: any) =>
  split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

export const getApolloClient = (networkId: number) => {
  const { httpUri, wsUri } = getGraphUris(networkId);
  const httpLink = new HttpLink({
    uri: httpUri,
  });
  const wsLink = new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true,
    },
  });
  return new ApolloClient({
    link: from([apolloLogger as any, getLink(httpLink, wsLink)]),
    cache: new InMemoryCache(),
  });
};
