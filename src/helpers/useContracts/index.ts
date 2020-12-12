import { getContractAddress } from "config/networks";
import { ConnectedWeb3Context } from "contexts";
import { useMemo } from "react";
import { ERC20Service, ERC721Service } from "services";

export const useContracts = (context: ConnectedWeb3Context) => {
  const { account, library: provider, networkId = 1 } = context;

  const gswapTokenAddress = getContractAddress(networkId, "gswap");
  const gswap = useMemo(
    () => new ERC20Service(provider, account, gswapTokenAddress),
    [provider, account, gswapTokenAddress]
  );

  const erc721TokenAddress = getContractAddress(networkId, "erc721");
  const erc721 = useMemo(
    () => new ERC721Service(provider, account, erc721TokenAddress),
    [provider, account, erc721TokenAddress]
  );

  return { gswap, erc721 };
};
