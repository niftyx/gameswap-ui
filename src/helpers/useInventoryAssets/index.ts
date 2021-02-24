import axios from "axios";
import {
  DEFAULT_NETWORK_ID,
  INVENTORY_PAGE_ASSET_COUNT,
} from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { IGraphInventoryAsset, IGraphInventoryResponse } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("useInventoryAssets:");

const query = `query GetInventoryAssets($id: ID!, $skip: Int!, $first: Int!) {
    account(id: $id) {
      address
      assetCount
      assets(first: $first, skip: $skip) {
        id
        assetId
        assetURL
        createTimeStamp
        updateTimeStamp
      }
    }
  }
`;

interface IOptions {
  id: string;
}

interface IState {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
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
}): IGraphInventoryAsset => {
  return {
    id: asset.id,
    assetURL: asset.assetURL,
    createTimeStamp: Number(asset.createTimeStamp),
    assetId: BigNumber.from(asset.assetId),
    updateTimeStamp: Number(asset.updateTimeStamp),
  };
};

export const useInventoryAssets = (
  options: IOptions
): {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loadMore: () => Promise<void>;
  removeItem: (_: string) => void;
  loading: boolean;
} => {
  const httpUri = "";
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: false,
  });

  const fetchData = async (variables: {
    first: number;
    skip: number;
    id: string;
  }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response: { data: IGraphInventoryResponse } = (
        await fetchQuery(
          query,
          { ...variables, id: variables.id.toLowerCase() },
          httpUri
        )
      ).data;
      const info = response.data.account;
      if (isRefMounted.current === false) return;
      if (info)
        setState((prevState) => ({
          ...prevState,
          hasMore:
            info.assetCount >
            prevState.assets.length + INVENTORY_PAGE_ASSET_COUNT,
          assets: [
            ...prevState.assets,
            ...info.assets.map((e) => wrangleAsset(e as any)),
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
      first: INVENTORY_PAGE_ASSET_COUNT,
      skip: state.assets.length,
      id: options.id,
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
    if (options.id) {
      fetchData({
        first: INVENTORY_PAGE_ASSET_COUNT,
        skip: 0,
        id: options.id,
      });
    }

    // eslint-disable-next-line
  }, [options.id, httpUri]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    removeItem,
    loading: state.loading,
  };
};
