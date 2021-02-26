import { BigNumber } from "ethers";
import { ISignedOrder } from "utils/types";

export interface IGraphInventoryAsset {
  id: string;
  collectionId: string;
  assetId: BigNumber;
  assetURL: string;
  createTimeStamp: number;
  updateTimeStamp: number;
  isInSale?: boolean;
  orders?: ISignedOrder[];
  owner: string;
}

export interface IGraphAccount {
  assetCount: number;
  address: string;
  createTimeStamp: number;
}

export interface IGraphInventoryResponse {
  account: IGraphAccount & {
    assets: {
      id: string;
      assetId: string;
      assetURL: string;
      createTimeStamp: string;
    }[];
  };
}

export interface IAssetDetails extends IGraphInventoryAsset {
  tokenAddress: string;
}
