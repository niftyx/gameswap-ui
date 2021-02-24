import axios from "axios";
import { API_BASE_URL } from "config/constants";

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
}

const apiService = new APIService();

export const getAPIService = () => {
  return apiService;
};
