import { RateLimit } from "async-sema";
import axios from "axios";
import { IPFS_CONFIG } from "config/constants";
import ipfsClient from "ipfs-http-client";

const IPFS_IMAGE_ENDPOINT = `${IPFS_CONFIG.protocol}://${IPFS_CONFIG.host}:${IPFS_CONFIG.port}/api/v0/cat/`;

class IPFSService {
  private readonly _rateLimit: () => Promise<void>;
  public readonly ipfs: any;

  constructor() {
    this._rateLimit = RateLimit(10);
    this.ipfs = ipfsClient(IPFS_CONFIG);
  }

  async getData(ipfsEndpoint: string) {
    await this._rateLimit();
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
