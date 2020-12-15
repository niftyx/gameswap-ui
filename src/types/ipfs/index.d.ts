export interface IIPFSTokenData {
  image: string;
  name: string;
  description?: string;
  royalties: number;
  attributes: [{ [key: string]: string }];
}
