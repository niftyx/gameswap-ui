import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { EHistoryItemType } from "utils/enums";
import { getLogger } from "utils/logger";
import { ZERO_NUMBER } from "utils/number";
import { ZERO_ADDRESS } from "utils/token";
import { IHistoryItem } from "utils/types";

const logger = getLogger("useAssetHistoryFromId");

interface IResponse {
  history: IHistoryItem[];
  loading: boolean;
}

interface IState {
  history: IHistoryItem[];
  loading: boolean;
}

export const useAssetHistoryFromId = (id: string): IResponse => {
  const [state, setState] = useState<IState>({
    history: [],
    loading: false,
  });
  const isRefMounted = useIsMountedRef();

  const apiService = getAPIService();

  const loadHistory = async (id: string) => {
    setState((prev) => ({ ...prev, history: [], loading: true }));
    try {
      const response = await apiService.getAssetHistory(id);
      const history = response.records;
      const final: IHistoryItem[] = [];

      if (history.length > 0) {
        let prevAddress = ZERO_ADDRESS;
        for (let index = history.length - 1; index >= 0; index--) {
          const historyItem = history[index];
          const finalItem: IHistoryItem = {
            id: historyItem.id,
            timestamp: historyItem.timestamp,
            from: prevAddress,
            to: historyItem.owner,
            txHash: historyItem.txHash,
            price: {
              tokenAddress: historyItem.erc20,
              amount: BigNumber.from(historyItem.erc20Amount.hex),
            },
            type: EHistoryItemType.Created,
          };

          if (prevAddress !== ZERO_ADDRESS) {
            if (finalItem.price?.amount.eq(ZERO_NUMBER)) {
              finalItem.type = EHistoryItemType.Transfer;
            } else {
              finalItem.type = EHistoryItemType.Sale;
            }
          }

          prevAddress = historyItem.owner;

          final.unshift(finalItem);
        }
      }

      if (isRefMounted.current === true)
        setState((prev) => ({ ...prev, history: final, loading: false }));
    } catch (error) {
      logger.warn(error);
      setState((prev) => ({ ...prev, history: [], loading: false }));
    }
  };

  useEffect(() => {
    loadHistory(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return state;
};
