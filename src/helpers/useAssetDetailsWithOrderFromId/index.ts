import { SignedOrder, assetDataUtils } from "@0x/order-utils";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { getZEROXService } from "services/zeroX";
import { getLogger } from "utils/logger";
import { buildOrdersQuery, wrangeOrderResponse } from "utils/order";
import {
  EthersBigNumberTo0xBigNumber,
  xBigNumberToEthersBigNumber,
} from "utils/token";
import {
  IAssetItem,
  IIpfsMainData,
  ISignedOrder,
  NetworkId,
} from "utils/types";

const logger = getLogger("useAssetDetailsWithOrderFromId");

interface IResponse {
  data: IAssetItem | null;
  loading: boolean;
}

interface IState {
  asset: IAssetItem | null;
  loading: boolean;
}

export const useAssetDetailsWithOrderFromId = (id: string): IResponse => {
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    asset: null,
    loading: false,
  });
  const isRefMounted = useIsMountedRef();

  const apiService = getAPIService();

  const loadAssetInfo = async (assetId: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const response = await apiService.getAssetDetails(assetId);
    if (isRefMounted.current === false) return;
    if (response) {
      setState((prev) => ({
        ...prev,
        loading: false,
        asset: {
          ...(response as any),
          owner: response.currentOwner.id,
          creator: response.creator.id,
          collectionId: response.collection.id,
          tokenId: BigNumber.from(response.assetId.hex),
          tokenURL: response.assetURL,
        },
      }));
    } else {
      setState((prev) => ({ ...prev, loading: false, asset: null }));
    }
  };

  useEffect(() => {
    loadAssetInfo(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId]);

  useEffect(() => {
    let isMounted = true;
    const loadAssetDetails = async () => {
      if (!state.asset || !state.asset.tokenURL || !state.asset.tokenId) return;
      try {
        const details: IIpfsMainData = (
          await getIPFSService().getData(state.asset.tokenURL)
        ).data;
        const orderEndPoint = buildOrdersQuery(
          (networkId || DEFAULT_NETWORK_ID) as NetworkId,
          {
            perPage: 1,
            makerAssetData: assetDataUtils.encodeERC721AssetData(
              state.asset.collectionId,
              EthersBigNumberTo0xBigNumber(state.asset.tokenId)
            ),
          }
        );
        const zeroXService = getZEROXService();
        const ordersResponse = (await zeroXService.getData(orderEndPoint)).data;
        const ordersResult: ISignedOrder[] = ordersResponse.records
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
          });

        if (isMounted)
          setState((prevState) => ({
            ...prevState,
            loading: false,
            asset: prevState.asset
              ? {
                  ...prevState.asset,
                  ...details,
                  priceChange: 0,
                  usdPrice: 0,
                  orders: ordersResult,
                }
              : null,
          }));
      } catch (error) {
        logger.error(error);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };
    if (state.asset && state.asset.id === id && !state.asset.name) {
      loadAssetDetails();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [state.asset]);

  return { data: state.asset, loading: state.loading };
};
