import { useEffect, useState } from "react";
import { getIPFSService } from "services/ipfs";
import { IGraphInventoryAsset, IIPFSTokenData } from "types";
import { getLogger } from "utils/logger";
import { IAssetItem } from "utils/types";

const logger = getLogger("useAssetDetailsFromInventoryItem::");

interface IState {
  loaded: boolean;
  asset: IAssetItem | null;
}

export const useAssetDetailsFromInventoryItem = (
  data: IGraphInventoryAsset
): IState => {
  const [state, setState] = useState<IState>({
    loaded: false,
    asset: null,
  });
  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        const details: IIPFSTokenData = JSON.parse(
          (await getIPFSService().getData(data.assetURL)).data
        );
        const base64: string = (await getIPFSService().getData(details.image))
          .data;
        setState((prevState) => ({
          ...prevState,
          asset: {
            id: data.id,
            tokenId: data.assetId,
            tokenURL: data.assetURL,
            createTimeStamp: data.createTimeStamp,
            ...details,
            priceChange: 0,
            usdPrice: 0,
            base64,
            isInSale: data.isInSale,
            orders: data.orders,
          },
          loaded: true,
        }));
      } catch (error) {
        logger.error(error);
        setLoaded(false);
      }
    };

    if (!state.asset || state.asset.id !== data.id) {
      setState((prevState) => ({
        ...prevState,
        asset: null,
        loaded: false,
        base64: null,
      }));
      loadAssetDetails();
    }
  }, [data.id]);

  return state;
};
