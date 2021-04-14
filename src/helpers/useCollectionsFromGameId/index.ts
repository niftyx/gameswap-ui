import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { ICollection } from "utils/types";

interface IState {
  loading: boolean;
  collections: ICollection[];
}

export const useCollectionsFromGameId = (
  id?: string
): IState & {
  loadCollectionsRelatedGame: () => Promise<ICollection[]>;
} => {
  const [state, setState] = useState<IState>({
    loading: true,
    collections: [],
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const apiService = getAPIService();
  const isMounted = useIsMountedRef();

  const loadCollectionsRelatedGame = async (): Promise<ICollection[]> => {
    if (!id) return [];
    setState(() => ({ loading: true, collections: [] }));
    try {
      const response = await apiService.getCollectionsRelatedToGame(id);
      if (isMounted.current === true)
        setState(() => ({
          collections: response.records,
          loading: false,
        }));

      return response.records;
    } catch (error) {
      setState(() => ({ loading: false, collections: [] }));
      return [];
    }
  };

  useEffect(() => {
    if (id) {
      loadCollectionsRelatedGame();
    } else {
      setState({ loading: false, collections: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { ...state, loadCollectionsRelatedGame };
};
