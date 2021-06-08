import { RateLimit } from "async-sema";
import axios from "axios";
import { API_BASE_URL } from "config/constants";
import { BigNumber } from "packages/ethers";
import { IAssetItem, ICollection, IGame, IUserInfo } from "utils/types";

axios.defaults.baseURL = API_BASE_URL;

interface IAssetHistoryResponseRecord {
  erc20: string;
  erc20Amount: any;
  id: string;
  owner: string;
  timestamp: number;
  txHash: string;
}

export class APIService {
  private readonly _rateLimit: () => Promise<void>;

  private readonly cryptoContentPath = "/lock-content/v1/";
  private readonly gamePath = "/games/v1/";
  private readonly collectionPath = "/collections/v1/";
  private readonly assetPath = "/assets/v1/";
  private readonly userPath = "/users/v1/";
  private readonly commonPath = "/common/v1/";

  constructor() {
    this._rateLimit = RateLimit(20);
  }

  /**
   * Games
   * get all games
   */
  public async getGames(query?: string) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.gamePath}all${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  /**
   * Games
   * search games
   */
  public async searchGames(keyword?: string) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.gamePath}search${keyword ? `?keyword=${keyword || ""}` : ""}`
    );
    return response.data as IGame[];
  }

  /**
   * Games
   * get collections related to game
   */
  public async getCollectionsRelatedToGame(
    id: string,
    perPage?: number,
    page?: number
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.collectionPath}games/${id}?perPage=${perPage || 100}&page=${
        page || 1
      }`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: ICollection[];
    };
  }

  /**
   * Games
   * get assets related to game
   */
  public async getAssetsRelatedToGame(
    id: string,
    perPage?: number,
    page?: number
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.gamePath}${id}/assets?perPage=${perPage || 100}&page=${page || 1}`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: Record<string, unknown>[];
    };
  }

  /**
   * Games
   * get game
   */
  public async getGame(id: string) {
    await this._rateLimit();
    const response = await axios.get(`${this.gamePath}${id}`);
    return response.data as IGame;
  }

  /**
   * Games
   * create Game
   */
  public async createGame(payload: any): Promise<IGame> {
    await this._rateLimit();
    const response = await axios.post(this.gamePath, payload);
    return response.data;
  }

  /**
   * Games
   * create Game
   */
  public async updateGame(id: string, payload: any): Promise<IGame> {
    await this._rateLimit();
    const response = await axios.post(`${this.gamePath}${id}`, payload);
    return response.data;
  }

  /**
   * Collections
   * search collections
   */
  public async searchCollections(keyword?: string) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.collectionPath}search${
        keyword ? `?keyword=${keyword || ""}` : ""
      }`
    );
    return response.data as ICollection[];
  }

  /**
   * Collections
   * get all collections
   */
  public async getCollections(query?: string) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.collectionPath}all${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  /**
   * Collections
   * get collection
   */
  public async getCollection(id: string) {
    await this._rateLimit();
    const response = await axios.get(`${this.collectionPath}${id}`);
    return response.data;
  }

  /**
   * Crypto
   * encrypt content data
   */
  public async getEncryptedContentData(contentStr: string) {
    await this._rateLimit();
    const response = await axios.post(`${this.cryptoContentPath}encrypt`, {
      contentStr,
    });
    return response.data as { lockedData: string; contentId: string };
  }

  /**
   * Crypto
   * decrypt content data
   */
  public async getDecryptedContentData(contentStr: string, hashedStr: string) {
    await this._rateLimit();
    const response = await axios.post(`${this.cryptoContentPath}decrypt`, {
      contentStr,
      signedContentStr: hashedStr,
    });
    return response.data as string;
  }

  /**
   * Assets
   * list assets with query
   */
  public async listAssets(query?: any, perPage?: number, page?: number) {
    await this._rateLimit();
    const finalQuery = { ...query, page: page || 1, perPage: perPage || 20 };
    const queryString = Object.keys(finalQuery)
      .filter((key) => finalQuery[key])
      .map((key) => `${key}=${encodeURIComponent(finalQuery[key])}`)
      .join("&");
    const response = await axios.get(`${this.assetPath}all?${queryString}`);
    return response.data as {
      page: number;
      perPage: number;
      records: Record<string, unknown>[];
    };
  }

  /**
   * Assets
   * get asset details from asset id
   */
  public async getAssetDetails(id: string) {
    await this._rateLimit();
    const response = await axios.get(`${this.assetPath}${id}`);
    return response.data;
  }

  /**
   * Assets
   * get asset details with assetId and collection Id
   */
  public async getAssetDetailsWithAssetIdAndCollectionId(
    assetId: BigNumber,
    collectionId: string
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${
        this.assetPath
      }collection/${collectionId}/asset/${assetId.toHexString()}`
    );
    return response.data;
  }

  /**
   * Assets
   * get assets of user
   */
  public async getAssetsOfUser(
    ownerAddress: string,
    perPage?: number,
    page?: number
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.assetPath}user/${ownerAddress}?perPage=${perPage || 100}&page=${
        page || 1
      }`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: Record<string, unknown>[];
    };
  }

  /**
   * Assets
   * get assets of user
   */
  public async getAssetsOfCollection(
    collectionId: string,
    perPage?: number,
    page?: number
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.assetPath}collection/${collectionId}?perPage=${
        perPage || 100
      }&page=${page || 1}`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: Record<string, unknown>[];
    };
  }

  /**
   * Assets
   * get assets' creators
   */
  public async getAssetsOfCreatedUser(
    creatorAddress: string,
    perPage?: number,
    page?: number
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.assetPath}creator/${creatorAddress}?perPage=${
        perPage || 100
      }&page=${page || 1}`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: Record<string, unknown>[];
    };
  }

  /**
   * Assets
   * get history of asset
   */
  public async getAssetHistory(
    assetId: string,
    perPage?: number,
    page?: number
  ) {
    await this._rateLimit();
    const response = await axios.get(
      `${this.assetPath}${assetId}/history?perPage=${perPage || 100}&page=${
        page || 1
      }`
    );
    return response.data as {
      page: number;
      perPage: number;
      records: IAssetHistoryResponseRecord[];
    };
  }

  /**
   * Accounts
   * get account info
   */
  public async getAccountInfo(account: string) {
    await this._rateLimit();
    const response = await axios.get(`${this.userPath}${account}`);
    return response.data as IUserInfo;
  }

  /**
   * Accounts
   * update account info
   */
  public async updateAccountInfo(
    account: string,
    payload: any,
    signedMessage: string
  ) {
    await this._rateLimit();
    const response = await axios.post(`${this.userPath}${account}`, {
      ...payload,
      signedMessage,
    });
    return response.data as IUserInfo;
  }

  /**
   * check if customUrl is not duplicated (games/accounts)
   */
  public async checkCustomUrlUsable(url: string) {
    await this._rateLimit();

    const response = await axios.post(
      `${this.commonPath}check-custom-url-usable`,
      { url }
    );

    return response.data as boolean;
  }
  /**
   * get id of customUrl
   */
  public async getCustomUrlData(url: string) {
    await this._rateLimit();

    const response = await axios.post(`${this.commonPath}custom-url-info`, {
      url,
    });

    return response.data;
  }
}

const apiService = new APIService();

export const getAPIService = () => {
  return apiService;
};
