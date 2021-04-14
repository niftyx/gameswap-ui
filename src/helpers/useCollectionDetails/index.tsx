import { BigNumber } from "@ethersproject/bignumber";
import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getLogger } from "utils/logger";
import { ICollection } from "utils/types";

const logger = getLogger("useCollectionDetails::");

export const wrangleCollection = (res: any): ICollection =>
  ({
    ...res,
    totalBurned: BigNumber.from(res.totalBurned.hex),
    totalMinted: BigNumber.from(res.totalMinted.hex),
    totalSupply: BigNumber.from(res.totalSupply.hex),
  } as ICollection);

interface IState {
  loading: boolean;
  collection?: ICollection;
}

export const useCollectionDetails = (
  id: string
): IState & {
  load: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({
    loading: true,
  });

  const isRefMounted = useIsMountedRef();
  const apiService = getAPIService();

  const loadCollectionDetails = async () => {
    if (!id) {
      setState(() => ({ loading: false }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const collection = await apiService.getCollection(id);
      setState(() => ({
        loading: false,
        collection: wrangleCollection(collection),
      }));
    } catch (error) {
      if (isRefMounted.current === true) setState(() => ({ loading: false }));
    }
  };

  useEffect(() => {
    loadCollectionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { ...state, load: loadCollectionDetails };
};
