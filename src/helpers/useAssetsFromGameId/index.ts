import { INVENTORY_PAGE_ASSET_COUNT } from "config/constants";
import { BigNumber } from "ethers";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { IGraphInventoryAsset } from "types";
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
}

export const useAssetsFromGameId = (
  id: string
): {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loadMore: () => Promise<void>;
  loading: boolean;
} => {
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: true,
  });

  const apiService = getAPIService();

  const fetchData = async (variables: {
    perPage: number;
    page: number;
    id: string;
  }) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));

      const info = await apiService.getAssetsRelatedToGame(
        variables.id,
        variables.perPage,
        variables.page
      );
      if (isRefMounted.current === false) return;
      if (info)
        setState((prevState) => ({
          ...prevState,
          hasMore: info.records.length === info.perPage,
          assets: [
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
      id,
    });
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      hasMore: false,
      assets: [],
    }));
    if (id) {
      fetchData({
        perPage: INVENTORY_PAGE_ASSET_COUNT,
        page: 1,
        id,
      });
    }

    // eslint-disable-next-line
  }, [id]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    loading: state.loading,
  };
};
