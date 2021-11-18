import { SignedOrder, assetDataUtils } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { AssetProxyIds, DEFAULT_NETWORK_ID } from "config/constants";
import { getToken, knownTokens } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getZEROXService } from "services/zeroX";
import { getLogger } from "utils/logger";
import { buildOrderBookQuery, wrangeOrderResponse } from "utils/order";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder, KnownToken } from "utils/types.d";

const logger = getLogger("useAssetOrders");

interface IState {
  asks: ISignedOrder[];
  bids: ISignedOrder[];
  loading: boolean;
}

export const useAssetOrders = (
  collectionId: string,
  assetId: BigNumber
): IState & { loadOrders: () => Promise<void> } => {
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    asks: [],
    bids: [],
    loading: true,
  });
  const isRefMounted = useIsMountedRef();
  const zeroXService = getZEROXService();

  const loadOrderbook = async (
    erc20TokenAddress: string
  ): Promise<{ bids: ISignedOrder[]; asks: ISignedOrder[] }> => {
    const baseAssetData = assetDataUtils.encodeERC721AssetData(
      collectionId,
      assetId
    );
    const quoteAssetData = assetDataUtils.encodeERC20AssetData(
      erc20TokenAddress
    );

    const endPoint = buildOrderBookQuery(networkId || DEFAULT_NETWORK_ID, {
      baseAssetData,
      quoteAssetData,
    });
    const orderBookResponse = (await zeroXService.getData(endPoint)).data;
    return {
      asks: orderBookResponse.asks.records
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
            erc20Address: erc20.tokenAddress,
          };
        }),
      bids: orderBookResponse.bids.records
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
        }),
    };
  };

  const loadData = async () => {
    setState(() => ({ asks: [], bids: [], loading: true }));
    try {
      const erc20TokenIds = Object.keys(knownTokens) as KnownToken[];
      const promises: Promise<{
        bids: ISignedOrder[];
        asks: ISignedOrder[];
      }>[] = [];

      erc20TokenIds.forEach((tokenId) => {
        const token = getToken(tokenId, networkId);
        promises.push(loadOrderbook(token.address));
      });

      const results: {
        bids: ISignedOrder[];
        asks: ISignedOrder[];
      }[] = await Promise.all(promises);

      const asks: ISignedOrder[] = [];
      const bids: ISignedOrder[] = [];

      results.forEach((element) => {
        asks.push(...element.asks);
        bids.push(...element.bids);
      });

      if (isRefMounted.current === true) {
        setState((prev) => ({ ...prev, loading: false, asks, bids }));
      }
    } catch (error) {
      logger.error("error::", error);
      if (isRefMounted.current === true) {
        setState(() => ({ asks: [], bids: [], loading: false }));
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId, assetId.toString()]);

  return { ...state, loadOrders: loadData };
};
