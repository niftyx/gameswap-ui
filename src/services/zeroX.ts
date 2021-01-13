import { RateLimit } from "async-sema";
import axios from "axios";

class ZeroXService {
  private readonly _rateLimit: () => Promise<void>;

  constructor() {
    this._rateLimit = RateLimit(10);
  }

  async getData(endPoint: string) {
    await this._rateLimit();
    return axios.get(endPoint);
  }
}

let zeroXService: ZeroXService;

export const getZEROXService = () => {
  if (!zeroXService) {
    zeroXService = new ZeroXService();
  }
  return zeroXService;
};
