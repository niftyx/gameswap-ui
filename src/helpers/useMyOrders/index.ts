import { assetDataUtils } from "@0x/order-utils";
import { SignedOrder } from "@0x/types";
import { DEFAULT_NETWORK_ID, ORDERS_PAGE_COUNT } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getZEROXService } from "services/zeroX";
import { getLogger } from "utils/logger";
import { buildOrdersQuery, wrangeOrderResponse } from "utils/order";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder, NetworkId } from "utils/types";

const logger = getLogger("useMyOrders::");

interface IState {
  allLoaded: boolean;
  orders: ISignedOrder[];
  loading: boolean;
}

export const useMyOrders = (): IState & { loadMore: () => Promise<void> } => {
  const { account, networkId } = useConnectedWeb3Context();
  const erc721Address = getContractAddress(
    networkId || DEFAULT_NETWORK_ID,
    "erc721"
  );
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    allLoaded: false,
    orders: [],
    loading: false,
  });

  const loadOrders = async (page = 1) => {
    const endPoint = buildOrdersQuery(
      (networkId || DEFAULT_NETWORK_ID) as NetworkId,
      {
        makerAddress: account || "",
        makerAssetAddress: erc721Address,
        perPage: ORDERS_PAGE_COUNT,
        page,
      }
    );

    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const zeroXService = getZEROXService();
      const fetchResult = (await zeroXService.getData(endPoint)).data;

      const allLoaded =
        fetchResult.total === state.orders.length + fetchResult.records.length;

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
            erc721Address: erc721.tokenAddress,
            erc20Address: erc20.tokenAddress,
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

  useEffect(() => {
    setState({ allLoaded: account ? false : true, orders: [], loading: false });
    if (account) {
      loadOrders();
    }
    // eslint-disable-next-line
  }, [account, networkId]);

  return { ...state, loadMore: loadMoreOrders };
};
