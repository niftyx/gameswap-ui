import fleekStorage from "@fleekhq/fleek-storage-js";
import { RateLimit } from "async-sema";
import axios from "axios";
import { FLEEK_API_KEY, FLEEK_API_SECRET } from "config/constants";
import moment from "moment";
import { v4 as uuidV4 } from "uuid";

class FleekService {
  private readonly _rateLimit: () => Promise<void>;
  public readonly apiKey: string;
  public readonly apiSecret: string;

  constructor() {
    this._rateLimit = RateLimit(10);
    this.apiKey = FLEEK_API_KEY;
    this.apiSecret = FLEEK_API_SECRET;
  }

  async getData(ipfsEndpoint: string) {
    await this._rateLimit();
    return axios.get(ipfsEndpoint);
  }

  async uploadData(data: any, onProgress?: (progress: number) => void) {
    const todayStr = moment().format("YYYY-MM-DD");
    const key = `${todayStr}/${uuidV4()}`;

    const uploadedFile = await fleekStorage.upload({
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      key,
      data,
    });
    return uploadedFile.publicUrl;
  }
}

let fleekService: FleekService;

export const getFLEEKService = () => {
  if (!fleekService) {
    fleekService = new FleekService();
  }
  return fleekService;
};
