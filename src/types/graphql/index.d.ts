import { BigNumber } from "ethers";

export interface IGraphInventoryAsset {
  id: string;
  assetId: BigNumber;
  assetURL: string;
  createTimeStamp: number;
  updateTimeStamp: number;
  isInSale?: boolean;
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
  currentOwner: string;
  tokenAddress: string;
}
