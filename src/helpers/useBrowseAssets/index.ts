import axios from "axios";
import { BROWSE_PAGE_ASSET_COUNT } from "config/constants";
import { getGraphUris } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { IAssetDetails } from "types";
import { getLogger } from "utils/logger";

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
  currentOwner: { address: string };
  token: { address: string };
}): IAssetDetails => {
  return {
    id: asset.id,
    assetURL: asset.assetURL,
    createTimeStamp: Number(asset.createTimeStamp),
    assetId: BigNumber.from(asset.assetId),
    updateTimeStamp: Number(asset.updateTimeStamp),
    currentOwner: asset.currentOwner.address,
    tokenAddress: asset.token.address,
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
  const { httpUri } = getGraphUris(networkId || 1);

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
      if (info)
        setState((prevState) => ({
          ...prevState,
          hasMore: info.assets.length >= BROWSE_PAGE_ASSET_COUNT,
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
