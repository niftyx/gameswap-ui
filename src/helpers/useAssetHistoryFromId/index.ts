import { DEFAULT_NETWORK_ID } from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { EHistoryItemType } from "utils/enums";
import { fetchQuery } from "utils/graphql";
import { getLogger } from "utils/logger";
import { ZERO_NUMBER } from "utils/number";
import { queryAssetHistoryByAssetId } from "utils/queries";
import { ZERO_ADDRESS, toCamelCaseObj } from "utils/token";
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

  const { networkId } = useConnectedWeb3Context();
  const hasura = getHasuraServerUrl(networkId);

  const loadHistory = async (id: string) => {
    setState((prev) => ({ ...prev, history: [], loading: true }));
    try {
      const response = (
        await fetchQuery(
          queryAssetHistoryByAssetId,
          { id: id.toLowerCase(), offset: 0, limit: 10 },
          hasura.httpUri
        )
      ).data;
      if (
        response.data &&
        response.data.asset_histories &&
        response.data.asset_histories.length > 0
      ) {
        const history = response.data.asset_histories.map((e: any) => {
          return toCamelCaseObj(e);
        });
        const final: IHistoryItem[] = [];

        if (history.length > 0) {
          let prevAddress = ZERO_ADDRESS;
          for (let index = history.length - 1; index >= 0; index--) {
            const historyItem = history[index];
            const finalItem: IHistoryItem = {
              id: historyItem.id,
              timestamp: historyItem.timestamp,
              from: prevAddress,
              to: historyItem.ownerId,
              txHash: historyItem.txHash,
              price: {
                tokenAddress: historyItem.erc20,
                amount: BigNumber.from(historyItem.erc20Amount || "0"),
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
      }
    } catch (error) {
      logger.error(error);
      setState((prev) => ({ ...prev, history: [], loading: false }));
    }
  };

  useEffect(() => {
    loadHistory(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return state;
};
