import { SignedOrder, assetDataUtils } from "@0x/order-utils";
import axios from "axios";
import { BROWSE_PAGE_ASSET_COUNT, DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { IAssetDetails } from "types";
import { getLogger } from "utils/logger";
import { buildOrdersQuery, wrangeOrderResponse } from "utils/order";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder, NetworkId } from "utils/types";

const logger = getLogger("useInventoryAssets:");

const query = `query GetBrowseAssets($skip: Int!, $first: Int!) {
    assets(where:{currentOwner_not:"0x0000000000000000000000000000000000000000"},first: $first, skip: $skip) {
      id
      assetId
      assetURL
      createTimeStamp
      updateTimeStamp
      currentOwner {
        address
      }
      token {
        address
      }
    }
  }
`;

interface IState {
  hasMore: boolean;
  assets: IAssetDetails[];
  loading: boolean;
}

type GraphVariables = { [key: string]: string | number };

const fetchQuery = (
  query: string,
  variables: GraphVariables,
  endpoint: string
) => {
  return axios.post(endpoint, { query, variables });
};

const wrangleAsset = (asset: {
  assetId: string;
  assetURL: string;
  createTimeStamp: string;
  updateTimeStamp: string;
  id: string;
  collectionId: string;
  currentOwner: { address: string };
  token: { address: string };
}): IAssetDetails => {
  return {
    id: asset.id,
    collectionId: asset.collectionId,
    assetURL: asset.assetURL,
    createTimeStamp: Number(asset.createTimeStamp),
    assetId: BigNumber.from(asset.assetId),
    updateTimeStamp: Number(asset.updateTimeStamp),
    tokenAddress: asset.token.address,
    owner: asset.currentOwner.address,
  };
};

interface IGraphBrowseResponse {
  assets: {
    id: string;
    assetId: string;
    assetURL: string;
    currentOwner: {
      address: string;
    };
    token: {
      address: string;
    };
  }[];
}

export const useBrowseAssets = (): {
  hasMore: boolean;
  assets: IAssetDetails[];
  loadMore: () => Promise<void>;
  removeItem: (_: string) => void;
  loading: boolean;
} => {
  const { networkId } = useConnectedWeb3Context();
  const httpUri = "";
  const isRefMounted = useIsMountedRef();

  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: false,
  });

  const fetchData = async (variables: { first: number; skip: number }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response: { data: IGraphBrowseResponse } = (
        await fetchQuery(query, variables, httpUri)
      ).data;
      const info = response.data;

      const getOrderPromises: Promise<ISignedOrder[]>[] = info.assets.map(
        (e) => {
          const asset = wrangleAsset(e as any);
          const endPoint = buildOrdersQuery(
            (networkId || DEFAULT_NETWORK_ID) as NetworkId,
            {
              perPage: 1,
            }
          );
          return new Promise((resolve, reject) => {
            axios
              .get(endPoint)
              .then((res) => {
                const ordersResult: ISignedOrder[] = res.data.records
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
                resolve(ordersResult);
              })
              .catch(reject);
          });
        }
      );

      const orders = await Promise.all(getOrderPromises);

      if (isRefMounted.current === false) return;
      if (info)
        setState((prevState) => ({
          ...prevState,
          hasMore: info.assets.length >= BROWSE_PAGE_ASSET_COUNT,
          assets: [
            ...prevState.assets,
            ...info.assets.map((e, index) => ({
              ...wrangleAsset(e as any),
              orders: orders[index],
            })),
          ],
          loading: false,
        }));
      else setState((prevState) => ({ ...prevState, loading: false }));
    } catch (error) {
      logger.error("fetchData:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const loadMore = async () => {
    await fetchData({
      first: BROWSE_PAGE_ASSET_COUNT,
      skip: state.assets.length,
    });
  };

  const removeItem = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      assets: prevState.assets.filter((asset) => asset.id !== id),
    }));
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      hasMore: false,
      assets: [],
    }));
    fetchData({
      first: BROWSE_PAGE_ASSET_COUNT,
      skip: 0,
    });

    // eslint-disable-next-line
  }, [httpUri]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    removeItem,
    loading: state.loading,
  };
};
