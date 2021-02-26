import axios from "axios";
import { API_BASE_URL } from "config/constants";
import { BigNumber } from "ethers";

axios.defaults.baseURL = API_BASE_URL;

export class APIService {
  private readonly cryptoContentPath = "/lock-content/v1/";
  private readonly gamePath = "/games/v1/";
  private readonly collectionPath = "/collections/v1/";
  private readonly assetPath = "/assets/v1/";
  private readonly accountPath = "/accounts/v1/";

  constructor() {}

  public async getGames() {
    const response = await axios.get(`${this.gamePath}all`);
    return response.data;
  }

  public async createGame(payload: any) {
    const response = await axios.post(this.gamePath, payload);
    return response.data;
  }

  public async getCollections() {
    const response = await axios.get(`${this.collectionPath}all`);
    return response.data;
  }

  public async getEncryptedContentData(contentStr: string) {
    const response = await axios.post(`${this.cryptoContentPath}encrypt`, {
      contentStr,
    });
    return response.data as { lockedData: string; contentId: string };
  }

  public async getAssetDetails(id: string) {
    const response = await axios.get(`${this.assetPath}${id}`);
    return response.data;
  }

  public async getAssetDetailsWithAssetIdAndCollectionId(
    assetId: BigNumber,
    collectionId: string
  ) {
    const response = await axios.get(
      `${
        this.assetPath
      }collection/${collectionId}/asset/${assetId.toHexString()}`
    );
    return response.data;
  }

  public async getAssetsByAddress(
    address: string,
    perPage?: number,
    page?: number
  ) {
    const response = await axios.get(
      `${this.assetPath}address/${address}?perPage=${perPage || 100}&page=${
        page || 1
      }`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: Record<string, unknown>[];
    };
  }
}

const apiService = new APIService();

export const getAPIService = () => {
  return apiService;
};
