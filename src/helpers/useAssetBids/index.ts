import { SignedOrder, assetDataUtils } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { AssetProxyIds, DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getZEROXService } from "services/zeroX";
import { getLogger } from "utils/logger";
import { buildOrdersQuery, wrangeOrderResponse } from "utils/order";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder } from "utils/types.d";

import { NetworkId } from "./../../utils/types.d";

const logger = getLogger("useAssetOrders");

interface IState {
  bids: ISignedOrder[];
  loading: boolean;
}

export const useAssetBids = (
  collectionId: string,
  assetId: BigNumber
): IState & { loadOrders: () => Promise<void> } => {
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    bids: [],
    loading: true,
  });
  const isRefMounted = useIsMountedRef();
  const zeroXService = getZEROXService();

  const loadBids = async () => {
    const takerAssetData = assetDataUtils.encodeERC721AssetData(
      collectionId,
      assetId
    );
    let page = 1;
    let totalLoaded = 0;
    let totalToLoad = 1;
    try {
      while (totalToLoad > totalLoaded) {
        const orderEndPoint = buildOrdersQuery(
          (networkId || DEFAULT_NETWORK_ID) as NetworkId,
          {
            takerAssetData,
            makerAssetProxyId: AssetProxyIds.erc20,

            page,
          }
        );
        const ordersResponse = (await zeroXService.getData(orderEndPoint)).data;
        page = ordersResponse.page;
        totalToLoad = ordersResponse.total;
        totalLoaded = totalLoaded + ordersResponse.records.length;
        const ordersResult: ISignedOrder[] = ordersResponse.records
          .map((e: any) => e.order)
          .map((order: SignedOrder) => {
            const erc721 = assetDataUtils.decodeAssetDataOrThrow(
              order.takerAssetData
            ) as any;
            const erc20 = assetDataUtils.decodeAssetDataOrThrow(
              order.makerAssetData
            ) as any;

            return {
              ...wrangeOrderResponse(order),
              assetId: xBigNumberToEthersBigNumber(erc721.tokenId),
              erc721Address: erc721.tokenAddress.toLowerCase(),
              erc20Address: erc20.tokenAddress,
            };
          });
        if (isRefMounted.current === true)
          setState((prev) => ({
            ...prev,
            bids: [...prev.bids, ...ordersResult],
          }));
      }
    } catch (error) {
      logger.error("error::", error);
      if (isRefMounted.current === true) {
        setState((prev) => ({ ...prev, bids: [] }));
      }
    }
  };

  const loadData = async () => {
    setState(() => ({ bids: [], loading: true }));
    try {
      await loadBids();
      if (isRefMounted.current === true) {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      logger.error("error::", error);
      if (isRefMounted.current === true) {
        setState(() => ({ bids: [], loading: false }));
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId, assetId.toString()]);

  return { ...state, loadOrders: loadData };
};
