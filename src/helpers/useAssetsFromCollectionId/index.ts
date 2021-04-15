import { INVENTORY_PAGE_ASSET_COUNT } from "config/constants";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
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

export const useAssetsFromCollectionId = (
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
    loading: false,
  });

  const apiService = getAPIService();

  const fetchData = async (perPage: number, page: number, id: string) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));

      const info = await apiService.getAssetsOfCollection(id, perPage, page);
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
    await fetchData(
      INVENTORY_PAGE_ASSET_COUNT,
      Math.floor(state.assets.length / INVENTORY_PAGE_ASSET_COUNT) + 1,
      id
    );
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      hasMore: false,
      assets: [],
    }));
    if (id) {
      fetchData(INVENTORY_PAGE_ASSET_COUNT, 1, id);
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