export interface IGraphInventoryAsset {
  id: string;
  assetId: BigNumber;
  assetURL: string;
  createTimeStamp: number;
}

export interface IGraphAccount {
  assetCount: number;
  address: string;
  createTimeStamp: number;
}

export interface IGraphInventoryResponse {
  account: IGraphAccount & {
    assets: IGraphInventoryAsset[];
  };
}
