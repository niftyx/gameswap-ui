import { getImageUrl } from "utils/token";
import { entries } from "utils/type-utils";
import {
  I0xContractAddresses,
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContracts,
  KnownToken,
  NetworkId,
} from "utils/types";

import {
  GRAPH_KOVAN_HTTP,
  GRAPH_KOVAN_WS,
  GRAPH_MAINNET_HTTP,
  GRAPH_MAINNET_WS,
  INFURA_PROJECT_ID,
} from "./constants";

export const networkIds = {
  MAINNET: 1,
  KOVAN: 42,
  AVAXTEST: 43113,
  AVAXMAIN: 43114,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MAINNET]: {
    label: "Mainnet",
    url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    graphHttpUri: GRAPH_MAINNET_HTTP,
    graphWsUri: GRAPH_MAINNET_WS,
    contracts: {
      erc721: "0x254D5259539b3ec85Cd76A1931899ec7E8851dD4",
      erc721Factory: "0x6e50D56d8F67A6acA10D5F0cF69e7eA9518E8181",
    },
    etherscanUri: "https://etherscan.io/",
  },
  [networkIds.KOVAN]: {
    label: "Kovan",
    url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    graphHttpUri: GRAPH_KOVAN_HTTP,
    graphWsUri: GRAPH_KOVAN_WS,
    contracts: {
      erc721: "0xb917795f6b1107f2635df03df1f4a97c29959dd9",
      erc721Factory: "",
    },
    etherscanUri: "https://kovan.etherscan.io/",
  },
  [networkIds.AVAXTEST]: {
    label: "Kovan",
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    graphHttpUri: GRAPH_KOVAN_HTTP,
    graphWsUri: GRAPH_KOVAN_WS,
    contracts: {
      erc721: "0x3c563b93cf3cc1ad687f117a19c33cf4bb69ca8f",
      erc721Factory: "0x5915A56d8Ec547624b09d8271ad2672003b33c44",
    },
    etherscanUri: "https://cchain.explorer.avax-test.network/",
  },
  [networkIds.AVAXMAIN]: {
    label: "Kovan",
    url: "https://api.avax.network/ext/bc/C/rpc",
    graphHttpUri: GRAPH_KOVAN_HTTP,
    graphWsUri: GRAPH_KOVAN_WS,
    contracts: {
      erc721: "0xb917795f6b1107f2635df03df1f4a97c29959dd9",
      erc721Factory: "0x4eB6F07F24f311143cAAd5D698D99e06dfCFd91f",
    },
    etherscanUri: "https://cchain.explorer.avax.network/",
  },
};

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const knownTokens: { [name in KnownToken]: IKnownTokenData } = {
  gswap: {
    symbol: "GSWAP",
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: "0xaac41ec512808d64625576eddd580e7ea40ef8b2",
      [networkIds.KOVAN]: "0xb2c7d27f78bec818391498dc4108ab782d65cd76",
      [networkIds.AVAXTEST]: "0x444806D2C0856c12dD8DB239b809Fc4641FCbB5E",
      [networkIds.AVAXMAIN]: "0xb2c7d27f78bec818391498dc4108ab782d65cd76",
    },
    coingeckoTokenId: "gameswap-org",
  },
  shroom: {
    symbol: "SHROOM",
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: "0xed0439eacf4c4965ae4613d77a5c2efe10e5f183",
      [networkIds.KOVAN]: "0x60508ceea2bae1eeaa0f192dedbec8a8b0ca3605",
      [networkIds.AVAXTEST]: "0xbE0382B9cbD516527431beADad01A683641956c4",
      [networkIds.AVAXMAIN]: "0xb2c7d27f78bec818391498dc4108ab782d65cd76",
    },
    coingeckoTokenId: "shroom-finance",
  },
};

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string;
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
);

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined;
};

export const getContractAddress = (
  networkId: number,
  contract: KnownContracts
): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return networks[networkId].contracts[contract];
};

export const getToken = (networkId: number, tokenId: KnownToken): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  const token = knownTokens[tokenId];
  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`);
  }

  const address = token.addresses[networkId];

  if (!address) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return {
    address,
    decimals: token.decimals,
    symbol: token.symbol,
    image: getImageUrl(address),
    coingeckoTokenId: token.coingeckoTokenId,
  };
};

export const getTokenFromAddress = (
  networkId: number,
  address: string
): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId];

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue;
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        address: tokenAddress,
        decimals: token.decimals,
        symbol: token.symbol,
        coingeckoTokenId: token.coingeckoTokenId,
      };
    }
  }

  throw new Error(
    `Couldn't find token with address '${address}' in network '${networkId}'`
  );
};

export const getContractAddressName = (networkId: number) => {
  const networkName = Object.keys(networkIds).find(
    (key) => (networkIds as any)[key] === networkId
  );
  const networkNameCase =
    networkName &&
    networkName.substr(0, 1).toUpperCase() +
      networkName.substr(1).toLowerCase();
  return networkNameCase;
};

export const getEtherscanUri = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return networks[networkId].etherscanUri;
};

export const getGraphUris = (
  networkId: number
): { httpUri: string; wsUri: string } => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  const httpUri = networks[networkId].graphHttpUri;
  const wsUri = networks[networkId].graphWsUri;
  return { httpUri, wsUri };
};

const OxContractAddresses: { [key in NetworkId]: I0xContractAddresses } = {
  [networkIds.MAINNET]: {
    exchange: "0x61935cbdd02287b511119ddb11aeb42f1593b7ef",
    erc20Proxy: "0x95e6f48254609a6ee006f7d493c8e5fb97094cef",
    erc721proxy: "0xefc70a1b18c432bdc64b596838b4d138f6bc6cad",
    devUtils: "0x161793cdca4ff9e766a706c2c49c36ac1340bbcd",
  },
  [networkIds.KOVAN]: {
    exchange: "0x4eacd0af335451709e1e7b570b8ea68edec8bc97",
    erc20Proxy: "0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e",
    erc721proxy: "0x2a9127c745688a165106c11cd4d647d2220af821",
    devUtils: "0x161793cdca4ff9e766a706c2c49c36ac1340bbcd",
  },
  [networkIds.AVAXTEST]: {
    exchange: "0xb74c1db81f26e3e545757328f8f208e314af9f49",
    erc20Proxy: "0x607935e692a7470cc6c68a3cb21ad72d59776f58",
    erc721proxy: "0x570a7bd05516774f4ea0163a77ce1d70ffc21454",
    devUtils: "0x3fe255415a82ce3f3907a624d936ba99c915928a",
  },
  [networkIds.AVAXMAIN]: {
    exchange: "0x4eacd0af335451709e1e7b570b8ea68edec8bc97",
    erc20Proxy: "0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e",
    erc721proxy: "0x2a9127c745688a165106c11cd4d647d2220af821",
    devUtils: "0x161793cdca4ff9e766a706c2c49c36ac1340bbcd",
  },
};

export const get0xContractAddresses = (
  networkId: number
): I0xContractAddresses => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return OxContractAddresses[networkId];
};
