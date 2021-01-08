import { getToken } from "config/networks";
import { ConnectedWeb3Context } from "contexts/connectedWeb3";
import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { ERC20Service } from "services";

export const useGSwapBalance = (
  context: ConnectedWeb3Context
): {
  balance: BigNumber;
  fetchBalance: () => Promise<void>;
} => {
  const { account, library: provider, networkId } = context;
  const isRefMounted = useIsMountedRef();
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const updateBalance = (newValue: BigNumber) => {
    if (!balance.eq(newValue)) {
      setBalance(newValue);
    }
  };

  const fetchBalance = async () => {
    try {
      const chainId = (provider?._network || {}).chainId;
      if (account && networkId && networkId === chainId) {
        const token = getToken(networkId, "gswap");
        const erc20Service = new ERC20Service(provider, account, token.address);
        const tokenBalance = await erc20Service.getBalanceOf(account);
        if (isRefMounted.current === true) updateBalance(tokenBalance);
      } else {
        updateBalance(BigNumber.from(0));
      }
    } catch (error) {
      console.warn("-useGSwapBalance-", error);
      updateBalance(BigNumber.from(0));
    }
  };
  useEffect(() => {
    fetchBalance();

    // eslint-disable-next-line
  }, [provider, provider?._network, account, networkId]);

  return { balance, fetchBalance };
};
