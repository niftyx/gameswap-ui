import { assetDataUtils } from "@0x/order-utils";
import { SignedOrder } from "@0x/types";
import {
  AssetProxyIds,
  DEFAULT_NETWORK_ID,
  ORDERS_PAGE_COUNT,
} from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getZEROXService } from "services/zeroX";
import { isObjectEqual } from "utils";
import { getLogger } from "utils/logger";
import { buildOrdersQuery, wrangeOrderResponse } from "utils/order";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder, NetworkId } from "utils/types";

const logger = getLogger("useAllOrders::");

interface IState {
  allLoaded: boolean;
  orders: ISignedOrder[];
  loading: boolean;
  query: any;
  networkId: any;
}

export const useAllOrders = (
  query?: any
): IState & { loadMore: () => Promise<void>; reload: () => Promise<void> } => {
  const { networkId } = useConnectedWeb3Context();

  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    allLoaded: false,
    orders: [],
    loading: false,
    query: null,
    networkId: null,
  });

  const finalNetworkId = networkId || DEFAULT_NETWORK_ID;
  const finalQuery = query || {};

  const loadOrders = async (page = 1) => {
    let orderQuery = { ...finalQuery, page, perPage: ORDERS_PAGE_COUNT };
    if (!orderQuery.makerAssetData) {
      orderQuery = { ...orderQuery, makerAssetProxyId: AssetProxyIds.erc721 };
    }
    if (!orderQuery.takerAssetData) {
      orderQuery = { ...orderQuery, takerAssetProxyId: AssetProxyIds.erc20 };
    }
    const endPoint = buildOrdersQuery(
      (networkId || DEFAULT_NETWORK_ID) as NetworkId,
      orderQuery
    );
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const zeroXService = getZEROXService();
      const fetchResult = (await zeroXService.getData(endPoint)).data;

      const allLoaded =
        fetchResult.total <= fetchResult.page * fetchResult.perPage;

      const ordersResult: ISignedOrder[] = fetchResult.records
        .map((e: any) => e.order)
        .map((order: SignedOrder) => {
          const erc721 = assetDataUtils.decodeAssetDataOrThrow(
            order.makerAssetData
          ) as any;
          const erc20 = assetDataUtils.decodeAssetDataOrThrow(
            order.takerAssetData
          ) as any;

          return {
            ...wrangeOrderResponse(order),
            assetId: xBigNumberToEthersBigNumber(erc721.tokenId),
            erc721Address: erc721.tokenAddress.toLowerCase(),
            erc20Address: erc20.tokenAddress.toLowerCase(),
          };
        });
      if (isRefMounted.current === true)
        setState((prevState) => ({
          ...prevState,
          orders: ordersResult,
          allLoaded,
          loading: false,
        }));
    } catch (error) {
      setState((prevState) => ({ ...prevState, loading: false }));
      logger.error("loadOrders", error);
    }
  };

  const loadMoreOrders = async () => {
    if (!state.allLoaded) {
      loadOrders(Math.floor(state.orders.length / ORDERS_PAGE_COUNT) + 1);
    }
  };

  const reload = async () => {
    setState((prevState) => ({
      ...prevState,
      allLoaded: false,
      orders: [],
      loading: false,
      networkId: finalNetworkId,
      query: finalQuery,
    }));
    try {
      loadOrders();
    } catch (error) {
      logger.warn(error);
    }
  };

  useEffect(() => {
    if (
      finalNetworkId !== state.networkId ||
      !isObjectEqual(finalQuery, state.query)
    ) {
      setState((prevState) => ({
        ...prevState,
        allLoaded: false,
        orders: [],
        loading: false,
        networkId: finalNetworkId,
        query: finalQuery,
      }));

      loadOrders();
    }

    // eslint-disable-next-line
  }, [finalNetworkId, finalQuery]);

  return { ...state, loadMore: loadMoreOrders, reload };
};
