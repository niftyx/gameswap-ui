import { IAssetAttribute } from "utils/types";

export interface IIPFSTokenData {
  image: string;
  name: string;
  description?: string;
  royalties: number;
  attributes: IAssetAttribute[];
}
