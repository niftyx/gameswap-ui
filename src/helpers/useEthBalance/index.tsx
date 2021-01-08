import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";

export const useEthBalance = (
  provider: any,
  account?: string
): {
  balance: BigNumber;
  fetchBalance: () => Promise<void>;
} => {
  const [ethBalance, setEthBalance] = useState<BigNumber>(BigNumber.from(0));
  const isRefMounted = useIsMountedRef();
  const fetchEthBalance = async () => {
    try {
      if (account) {
        const balance = await provider.getBalance(account || "");
        if (isRefMounted.current === true) setEthBalance(balance);
      } else {
        setEthBalance(BigNumber.from(0));
      }
    } catch (error) {
      setEthBalance(BigNumber.from(0));
    }
  };
  useEffect(() => {
    fetchEthBalance();
    // eslint-disable-next-line
  }, [provider, account]);

  return { balance: ethBalance, fetchBalance: fetchEthBalance };
};
