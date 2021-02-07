import { SignedOrder, assetDataUtils } from "@0x/order-utils";
import { useQuery } from "@apollo/react-hooks";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { getIPFSService } from "services/ipfs";
import { getZEROXService } from "services/zeroX";
import { IAssetDetails } from "types";
import { EFileType } from "utils/enums";
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
  Maybe,
  NetworkId,
} from "utils/types";

const logger = getLogger("useAssetDetailsWithOrderFromId");

const query = gql`
  query GetAsset($id: ID!) {
    asset(id: $id) {
      id
      assetId
      assetURL
      currentOwner {
        address
      }
      token {
        address
        name
        symbol
      }
      createTimeStamp
      updateTimeStamp
    }
  }
`;

interface IGraphResponse {
  asset: Maybe<
    IAssetDetails & {
      currentOwner: {
        address: string;
      };
      token: {
        address: string;
        name: string;
        symbol: string;
      };
    }
  >;
}

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
  const erc721TokenAddress = getContractAddress(
    networkId || DEFAULT_NETWORK_ID,
    "erc721"
  );
  const { data, refetch } = useQuery<IGraphResponse>(query, {
    notifyOnNetworkStatusChange: true,
    skip: false,
    variables: { id },
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId]);

  useEffect(() => {
    let isMounted = true;
    if (data && data.asset && id === data.asset.id) {
      if (!state.asset || state.asset.id !== id) {
        const { asset } = data;
        if (isMounted)
          setState((prevState) => ({
            ...prevState,
            asset: {
              id: asset?.id,
              tokenId: BigNumber.from(asset?.assetId),
              tokenURL: asset.assetURL,
              name: "",
              description: "",
              image: "",
              imageType: EFileType.Unknown,
              createTimeStamp: asset.createTimeStamp,
              usdPrice: 0,
              priceChange: 0,
              owner: asset.currentOwner.address,
            },
          }));
      }
    } else {
      setState((prevState) => ({ ...prevState, asset: null, loading: false }));
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [data]);

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
              erc721TokenAddress,
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
              erc721Address: erc721.tokenAddress,
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
