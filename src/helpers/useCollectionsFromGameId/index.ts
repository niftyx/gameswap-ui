import { useQuery } from "@apollo/react-hooks";
import { wrangleCollection } from "helpers/useCollectionDetails";
import { queryCollectionsByGameId } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { ICollection } from "utils/types";

interface IState {
  loading: boolean;
  collections: ICollection[];
}

interface GraphResponse {
  collections: any[];
}

export const useCollectionsFromGameId = (
  id: string
): IState & {
  loadCollectionsRelatedGame: () => Promise<void>;
} => {
  const { data, error, loading, refetch } = useQuery<GraphResponse>(
    queryCollectionsByGameId,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      skip: false,
      variables: { id, offset: 0, limit: 12 },
    }
  );

  const loadCollectionsRelatedGame = async () => {
    if (refetch) await refetch();
  };

  return {
    loading,
    collections:
      data && data.collections
        ? data.collections
            .map((e: any) => toCamelCaseObj(e))
            .map((e: any) => wrangleCollection(e))
        : [],
    loadCollectionsRelatedGame,
  };
};
