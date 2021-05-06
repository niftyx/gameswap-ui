import { INVENTORY_PAGE_ASSET_COUNT } from "config/constants";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { IGraphInventoryAsset } from "types";
import { isObjectEqual } from "utils";
import { getLogger } from "utils/logger";

const logger = getLogger("useInventoryAssets:");

const wrangleAsset = (e: any) => {
  return {
    ...e,
    assetId: BigNumber.from(e.assetId.hex),
    collectionId: e.collection.id,
    owner: e.currentOwner.id,
  } as IGraphInventoryAsset;
};

interface IState {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loading: boolean;
  query: any;
}

export const useInventoryAssets = (
  query: any
): {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loadMore: () => Promise<void>;
  removeItem: (_: string) => void;
  loading: boolean;
  reload: () => Promise<void>;
} => {
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: false,
    query: {},
  });

  const apiService = getAPIService();

  const fetchData = async (
    variables: {
      perPage: number;
      page: number;
    },
    flush?: boolean
  ) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));

      const info = await apiService.listAssets(
        query,
        variables.perPage,
        variables.page
      );
      if (isRefMounted.current === false) return;
      if (info)
        setState((prevState) => ({
          ...prevState,
          hasMore: info.records.length === info.perPage,
          assets: flush
            ? info.records.map((e) => wrangleAsset(e as any))
            : [
                ...prevState.assets,
                ...info.records.map((e) => wrangleAsset(e as any)),
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
  }, [query]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    removeItem,
    loading: state.loading,
    reload,
  };
};
