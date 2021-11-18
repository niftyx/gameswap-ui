import { getToken } from "config/networks";
import { ConnectedWeb3Context } from "contexts/connectedWeb3";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { ERC20Service } from "services";
import { ZERO_NUMBER } from "utils/number";
import { IBalances, KnownToken } from "utils/types";

const defaultBalances: IBalances = {
  eth: ZERO_NUMBER,
  erc20Balances: {
    gswap: ZERO_NUMBER,
    shroom: ZERO_NUMBER,
    wavax: ZERO_NUMBER,
  },
};

export const useBalances = (
  context: ConnectedWeb3Context
): {
  balances: IBalances;
  fetchBalances: () => Promise<void>;
} => {
  const { account, library: provider, networkId } = context;
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IBalances>(defaultBalances);

  const fetchERC20Balance = async (tokenId: KnownToken) => {
    try {
      const chainId = (provider?._network || {}).chainId;
      if (account && networkId && networkId === chainId) {
        const token = getToken(tokenId, networkId);
        const erc20Service = new ERC20Service(provider, account, token.address);
        const tokenBalance = await erc20Service.getBalanceOf(account);
        return tokenBalance;
      }
      return ZERO_NUMBER;
    } catch (error) {
      return ZERO_NUMBER;
    }
  };
  const fetchEthBalance = async () => {
    try {
      if (account && provider) {
        const balance = await provider.getBalance(account || "");
        return balance;
      }
      return ZERO_NUMBER;
    } catch (error) {
      return ZERO_NUMBER;
    }
  };

  const fetchBalances = async () => {
    try {
      const balances: IBalances = {
        eth: await fetchEthBalance(),
        erc20Balances: {
          gswap: await fetchERC20Balance("gswap"),
          shroom: await fetchERC20Balance("shroom"),
          wavax: await fetchERC20Balance("wavax"),
        },
      };
      if (isRefMounted.current === true) {
        setState(balances);
      }
    } catch (error) {
      if (isRefMounted.current === true) {
        setState(defaultBalances);
      }
    }
  };

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line
  }, [provider, provider?._network, account, networkId]);

  return { balances: state, fetchBalances };
};
