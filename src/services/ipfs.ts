import { RateLimit } from "async-sema";
import axios from "axios";

class IPFSService {
  private readonly _rateLimit: () => Promise<void>;

  constructor() {
    this._rateLimit = RateLimit(10);
  }

  async getData(ipfsEndpoint: string) {
    await this._rateLimit();
    return axios.get(ipfsEndpoint);
  }
}

let ipfsService: IPFSService;

export const getIPFSService = () => {
  if (!ipfsService) {
    ipfsService = new IPFSService();
  }
  return ipfsService;
};
