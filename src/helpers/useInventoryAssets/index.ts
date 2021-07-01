import { INVENTORY_PAGE_ASSET_COUNT } from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { IGraphInventoryAsset } from "types";
import { isObjectEqual } from "utils";
import { fetchQuery } from "utils/graphql";
import { getLogger } from "utils/logger";
import { buildQueryInventoryAssets } from "utils/queries";
import { toCamelCaseObj } from "utils/token";

const logger = getLogger("useInventoryAssets:");

const wrangleAsset = (e: any) => {
  return {
    ...e,
    assetId: BigNumber.from(e.assetId),
  } as IGraphInventoryAsset;
};

interface IState {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loading: boolean;
  query: any;
}

export const useInventoryAssets = (query: {
  gameId?: string;
  ownerId: string;
  collectionId?: string;
}): {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loadMore: () => Promise<void>;
  removeItem: (_: string) => void;
  loading: boolean;
  reload: () => Promise<void>;
} => {
  const { networkId } = useConnectedWeb3Context();
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: false,
    query: null,
  });

  const hasura = getHasuraServerUrl(networkId);

  const fetchData = async (
    variables: {
      perPage: number;
      page: number;
    },
    flush?: boolean
  ) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const { page, perPage } = variables;

      const response = (
        await fetchQuery(
          buildQueryInventoryAssets(query),
          {
            offset: perPage * (page - 1),
            limit: perPage + 1,
            ...query,
            ownerId: query.ownerId.toLowerCase(),
          },
          hasura.httpUri
        )
      ).data;

      if (isRefMounted.current === false) return;

      if (response.data && response.data.assets) {
        const hasMore = response.data.assets.length === perPage + 1;
        const records = response.data.assets
          .map((e: any) => toCamelCaseObj(e))
          .slice(0, perPage);

        setState((prevState) => ({
          ...prevState,
          hasMore,
          assets: flush
            ? records.map((e: any) => wrangleAsset(e as any))
            : [
                ...prevState.assets,
                ...records.map((e: any) => wrangleAsset(e as any)),
              ],
          loading: false,
        }));
      } else setState((prevState) => ({ ...prevState, loading: false }));
    } catch (error) {
      logger.error("fetchData:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const loadMore = async () => {
    await fetchData({
      perPage: INVENTORY_PAGE_ASSET_COUNT,
      page: Math.floor(state.assets.length / INVENTORY_PAGE_ASSET_COUNT) + 1,
    });
  };

  const removeItem = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      assets: prevState.assets.filter((asset) => asset.id !== id),
    }));
  };

  const reload = async () => {
    try {
      setState((prev) => ({
        ...prev,
        hasMore: false,
        assets: [],
        loading: false,
      }));
      await fetchData(
        {
          perPage: INVENTORY_PAGE_ASSET_COUNT,
          page: 1,
        },
        true
      );
    } catch (error) {
      logger.warn(error);
    }
  };

  useEffect(() => {
    if (!isObjectEqual(query, state.query)) {
      setState((prevState) => ({
        ...prevState,
        hasMore: false,
        assets: [],
        query,
      }));
      fetchData({
        perPage: INVENTORY_PAGE_ASSET_COUNT,
        page: 1,
      });
    }

    // eslint-disable-next-line
  }, [networkId]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    removeItem,
    loading: state.loading,
    reload,
  };
};
