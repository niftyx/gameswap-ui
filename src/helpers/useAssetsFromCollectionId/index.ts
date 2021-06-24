import {
  DEFAULT_NETWORK_ID,
  INVENTORY_PAGE_ASSET_COUNT,
} from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { IGraphInventoryAsset } from "types";
import { fetchQuery } from "utils/graphql";
import { getLogger } from "utils/logger";
import { queryAssetsByCollectionId } from "utils/queries";
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
  const { networkId } = useConnectedWeb3Context();
  const hasura = getHasuraServerUrl(networkId || DEFAULT_NETWORK_ID);

  const fetchData = async (perPage: number, page: number, id: string) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));

      const response = (
        await fetchQuery(
          queryAssetsByCollectionId,
          { offset: perPage * (page - 1), limit: perPage + 1, id },
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
          assets: [
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
