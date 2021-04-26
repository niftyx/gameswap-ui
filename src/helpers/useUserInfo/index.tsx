import { isAddress } from "@ethersproject/address";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getLogger } from "utils/logger";
import { IUserInfo } from "utils/types";

const logger = getLogger("useUserInfo::");

interface IState {
  loading: boolean;
  userInfo?: IUserInfo;
}

export const useUserInfo = (id: string) => {
  const [state, setState] = useState<IState>({ loading: false });
  const apiService = getAPIService();

  const userId = id.toLowerCase();

  useEffect(() => {
    let isMounted = true;
    if (!isAddress(userId)) {
      setState(() => ({ loading: false }));
      return;
    }

    const loadUserInfo = async () => {
      setState(() => ({ loading: true }));
      try {
        const userInfo = await apiService.getAccountInfo(userId);
        setState((prev) => ({ ...prev, userInfo, loading: false }));
      } catch (error) {
        setState(() => ({ loading: false }));
        logger.error(error);
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return state;
};
