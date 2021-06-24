import { useQuery } from "@apollo/react-hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { getLogger } from "utils/logger";
import { queryCollectionById } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { ICollection } from "utils/types";

const logger = getLogger("useCollectionDetails::");

export const wrangleCollection = (res: any): ICollection =>
  ({
    ...res,
    totalBurned: BigNumber.from(res.totalBurned),
    totalMinted: BigNumber.from(res.totalMinted),
    totalSupply: BigNumber.from(res.totalSupply),
  } as ICollection);

interface GraphResponse {
  collections: any[];
}

interface IState {
  loading: boolean;
  collection?: ICollection;
}

export const useCollectionDetails = (
  id: string
): IState & {
  load: () => Promise<void>;
} => {
  const { data, error, loading, refetch } = useQuery<GraphResponse>(
    queryCollectionById,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      skip: false,
      variables: { id },
    }
  );

  const loadCollectionDetails = async () => {
    if (refetch) await refetch();
  };

  return {
    loading,
    load: loadCollectionDetails,
    collection:
      data && data.collections.length > 0
        ? wrangleCollection(toCamelCaseObj(data.collections[0]))
        : undefined,
  };
};
