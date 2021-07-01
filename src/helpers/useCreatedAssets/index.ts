import { INVENTORY_PAGE_ASSET_COUNT } from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { IGraphInventoryAsset } from "types";
import { fetchQuery } from "utils/graphql";
import { getLogger } from "utils/logger";
import { queryAssetsByCreatorId } from "utils/queries";
import { toCamelCaseObj } from "utils/token";

const logger = getLogger("useCreatedAssets:");

const wrangleAsset = (e: any) => {
  return {
    ...e,
    assetId: BigNumber.from(e.assetId),
  } as IGraphInventoryAsset;
};
interface IOptions {
  id: string;
}

interface IState {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loading: boolean;
}

export const useCreatedAssets = (
  options: IOptions
): {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loadMore: () => Promise<void>;
  removeItem: (_: string) => void;
  loading: boolean;
} => {
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: false,
  });
  const { networkId } = useConnectedWeb3Context();
  const hasura = getHasuraServerUrl(networkId);

  const fetchData = async (variables: {
    perPage: number;
    page: number;
    id: string;
  }) => {
    try {
      const { id, page, perPage } = variables;
      setState((prevState) => ({ ...prevState, loading: true }));

      const response = (
        await fetchQuery(
          queryAssetsByCreatorId,
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
    await fetchData({
      perPage: INVENTORY_PAGE_ASSET_COUNT,
      page: Math.floor(state.assets.length / INVENTORY_PAGE_ASSET_COUNT) + 1,
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
        perPage: INVENTORY_PAGE_ASSET_COUNT,
        page: 1,
        id: options.id,
      });
    }

    // eslint-disable-next-line
  }, [options.id]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    removeItem,
    loading: state.loading,
  };
};
