declare module "ipfs-mini" {
  interface IIPFSConfig {
    host: string;
    port: number | string;
    protocol: string;
  }
  export declare class IPFS {
    constructor(provider: IIPFSConfig);
  }
}
