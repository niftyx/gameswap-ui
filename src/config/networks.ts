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

export const networkIds = {
  AVAXTEST: 43113,
  AVAXMAIN: 43114,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.AVAXTEST]: {
    label: "Avalanche Fuji Testnet",
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    contracts: {
      erc721Factory: process.env.REACT_APP_ERC721_FACTORY_TEST || "",
    },
    etherscanUri: "https://cchain.explorer.avax-test.network/",
    authService: "http://localhost:3008/graphql",
    hasuraService: "http://localhost:8080/v1/graphql",
  },
  [networkIds.AVAXMAIN]: {
    label: "Avalanche",
    url: "https://api.avax.network/ext/bc/C/rpc",
    contracts: {
      erc721Factory: process.env.REACT_APP_ERC721_FACTORY_MAIN || "",
    },
    etherscanUri: "https://cchain.explorer.avax.network/",
    authService: "http://localhost:3008/graphql",
    hasuraService: "http://localhost:8080/v1/graphql",
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
      [networkIds.AVAXTEST]: "0x1EeBC9a0e84006efE4067eDC78f3eB7636E730D5",
      [networkIds.AVAXMAIN]: "0xb2c7d27f78bec818391498dc4108ab782d65cd76",
    },
    coingeckoTokenId: "gameswap-org",
  },
  shroom: {
    symbol: "SHROOM",
    decimals: 18,
    addresses: {
      [networkIds.AVAXTEST]: "0xbE0382B9cbD516527431beADad01A683641956c4",
      [networkIds.AVAXMAIN]: "0xb2c7d27f78bec818391498dc4108ab782d65cd76",
    },
    coingeckoTokenId: "shroom-finance",
  },
  wavax: {
    symbol: "WAVAX",
    decimals: 18,
    addresses: {
      [networkIds.AVAXTEST]: "0x7f94faa738eb6326e98f2f84cae388c2913693cd",
      [networkIds.AVAXMAIN]: "0x7f94faa738eb6326e98f2f84cae388c2913693cd",
    },
    coingeckoTokenId: "avalanche-2",
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

export const getAuthServiceUri = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return networks[networkId].authService;
};

export const getHasuraServerUrl = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  return networks[networkId].hasuraService;
};

const OxContractAddresses: { [key in NetworkId]: I0xContractAddresses } = {
  [networkIds.AVAXTEST]: {
    exchange: "0xed72a76196839e2a2c77302bcf68eecc6f1783cc",
    erc20Proxy: "0xa58f950d88fd786c84b46dac517af2397e10a749",
    erc721proxy: "0xeba4a11bbb2bf9cfbf7d8d9fa0f8cf67d2daafd9",
    devUtils: "0xc150ea3b2b254f07cd4529d71bde590ed4bbd9fc",
    forwarder: "0xda08fee2c01a05338f416570762efea5badf148c",
  },
  [networkIds.AVAXMAIN]: {
    exchange: "0x4eacd0af335451709e1e7b570b8ea68edec8bc97",
    erc20Proxy: "0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e",
    erc721proxy: "0x2a9127c745688a165106c11cd4d647d2220af821",
    devUtils: "0x161793cdca4ff9e766a706c2c49c36ac1340bbcd",
    forwarder: "0xa165745421610c53818f9504a45ca68fdf56b475",
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

export const getNetworkName = (networkId: number): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return networks[networkId].label;
};
