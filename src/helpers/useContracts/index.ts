import { getContractAddress, getToken } from "config/networks";
import { ConnectedWeb3Context } from "contexts";
import { useMemo } from "react";
import { ERC20Service, ERC721Service } from "services";

export const useContracts = (context: ConnectedWeb3Context) => {
  const { account, library: provider, networkId = 1 } = context;

  const gswapToken = getToken(networkId, "gswap");
  const gswap = useMemo(
    () => new ERC20Service(provider, account, gswapToken.address),
    [provider, account, gswapToken.address]
  );

  const erc721TokenAddress = getContractAddress(networkId, "erc721");
  const erc721 = useMemo(
    () => new ERC721Service(provider, account, erc721TokenAddress),
    [provider, account, erc721TokenAddress]
  );

  return { gswap, erc721 };
};
