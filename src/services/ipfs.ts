import { RateLimit } from "async-sema";
import axios from "axios";
import { IPFS_CONFIG } from "config/constants";
import ipfsClient from "ipfs-http-client";

const IPFS_IMAGE_ENDPOINT = `${IPFS_CONFIG.protocol}://${IPFS_CONFIG.host}/ipfs/`;

class IPFSService {
  private readonly _rateLimit: () => Promise<void>;
  private readonly _infuraRateLimit: () => Promise<void>;
  public readonly ipfs: any;

  constructor() {
    this._rateLimit = RateLimit(50);
    this._infuraRateLimit = RateLimit(10);
    this.ipfs = ipfsClient(IPFS_CONFIG);
  }

  async getData(ipfsEndpoint: string) {
    if (ipfsEndpoint.includes("infura")) {
      await this._infuraRateLimit();
    } else {
      await this._rateLimit();
    }

    return axios.get(ipfsEndpoint);
  }

  async uploadData(data: any, onProgress?: (progress: number) => void) {
    const added = await this.ipfs.add(data, { progress: onProgress });
    const addedDataHash = added.cid.toString();
    return `${IPFS_IMAGE_ENDPOINT}${addedDataHash}`;
  }
}

let ipfsService: IPFSService;

export const getIPFSService = () => {
  if (!ipfsService) {
    ipfsService = new IPFSService();
  }
  return ipfsService;
};
