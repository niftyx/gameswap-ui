import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { waitSeconds } from "utils";
import { ICollection } from "utils/types";

const FakeCollections: ICollection[] = [
  {
    id: "123",
    name: "Collection Daylight",
    description: "ERC-20 / ERC-721",
    imageUrl: "/images/backgrounds/daylight.png",
    symbol: "CD7",
  },
  {
    id: "234",
    name: "Awesome collection",
    description: "ERC-721",
    imageUrl: "/images/backgrounds/resident.png",
    symbol: "CD7",
  },
  {
    id: "1",
    name: "Good collection",
    description: "ERC-1155",
    imageUrl: "/images/backgrounds/battlefield.png",
    symbol: "CD7",
  },
  {
    id: "13",
    name: "Cool",
    description: "ERC-1155",
    imageUrl: "/images/backgrounds/cyber-assault.png",
    symbol: "CD7",
  },
];

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
      // const response = await apiService.getCollectionsRelatedToGame(id);
      // logger.log("collections::", response);
      await waitSeconds(2);
      if (isMounted.current === true)
        setState(() => ({
          // collections: response.records,
          collections: FakeCollections,
          loading: false,
        }));

      return FakeCollections;
      // return response.records;
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
