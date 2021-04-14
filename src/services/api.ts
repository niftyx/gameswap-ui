import { RateLimit } from "async-sema";
import axios from "axios";
import { API_BASE_URL } from "config/constants";
import { BigNumber } from "packages/ethers";
import { ICollection, IGame, IUserInfo } from "utils/types";

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
  private readonly accountPath = "/accounts/v1/";

  constructor() {
    this._rateLimit = RateLimit(20);
  }

  /**
   * Games
   * get all games
   */
  public async getGames() {
    await this._rateLimit();
    const response = await axios.get(`${this.gamePath}all`);
    return response.data;
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
   * Collections
   * get all collections
   */
  public async getCollections() {
    await this._rateLimit();
    const response = await axios.get(`${this.collectionPath}all`);
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
    const response = await axios.get(`${this.accountPath}${account}`);
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
    const response = await axios.post(`${this.accountPath}${account}`, {
      ...payload,
      signedMessage,
    });
    return response.data as IUserInfo;
  }
}

const apiService = new APIService();

export const getAPIService = () => {
  return apiService;
};
