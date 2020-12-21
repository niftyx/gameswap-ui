import { useQuery } from "@apollo/react-hooks";
import { useConnectedWeb3Context } from "contexts";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { getIPFSService } from "services/ipfs";
import { IAssetDetails, IIPFSTokenData } from "types";
import { getLogger } from "utils/logger";
import { IAssetItem, Maybe } from "utils/types";

const logger = getLogger("useAssetDetailsFromId");

const query = gql`
  query GetAsset($id: ID!) {
    asset(id: $id) {
      id
      assetId
      assetURL
      currentOwner {
        address
      }
      token {
        address
        name
        symbol
      }
      createTimeStamp
      updateTimeStamp
    }
  }
`;

interface IGraphResponse {
  asset: Maybe<
    IAssetDetails & {
      currentOwner: {
        address: string;
      };
      token: {
        address: string;
        name: string;
        symbol: string;
      };
    }
  >;
}

interface IResponse {
  data: IAssetItem | null;
  loading: boolean;
}

interface IState {
  asset: IAssetItem | null;
  loading: boolean;
}

export const useAssetDetailsFromId = (id: string): IResponse => {
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    asset: null,
    loading: false,
  });

  const { data, error, loading, refetch } = useQuery<IGraphResponse>(query, {
    notifyOnNetworkStatusChange: true,
    skip: false,
    variables: { id },
  });

  useEffect(() => {
    refetch();
  }, [networkId]);

  useEffect(() => {
    if (data && data.asset && id === data.asset.id) {
      if (!state.asset || state.asset.id !== id) {
        const { asset } = data;
        setState((prevState) => ({
          ...prevState,
          asset: {
            id: asset?.id,
            tokenId: asset?.assetId,
            tokenURL: asset.assetURL,
            name: "",
            description: "",
            image: "",
            createTimeStamp: asset.createTimeStamp,
            usdPrice: 0,
            priceChange: 0,
          },
        }));
      }
    } else {
      setState((prevState) => ({ ...prevState, asset: null, loading: false }));
    }
    // eslint-disable-next-line
  }, [data]);

  const loadAssetDetails = async () => {
    if (!state.asset || !state.asset.tokenURL) return;
    try {
      const details: IIPFSTokenData = JSON.parse(
        (await getIPFSService().getData(state.asset.tokenURL)).data
      );
      const base64: string = (await getIPFSService().getData(details.image))
        .data;
      setState((prevState) => ({
        ...prevState,
        loading: false,
        asset: prevState.asset
          ? {
              ...prevState.asset,
              ...details,
              priceChange: 0,
              usdPrice: 0,
              base64,
            }
          : null,
      }));
    } catch (error) {
      logger.error(error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    if (state.asset && state.asset.id === id && !state.asset.name) {
      loadAssetDetails();
    }
    // eslint-disable-next-line
  }, [state.asset]);

  return { data: state.asset, loading: state.loading };
};
