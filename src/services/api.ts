import { RateLimit } from "async-sema";
import axios from "axios";
import { DEFAULT_NETWORK_ID } from "config/constants";
import {
  getBackendServiceUri,
  getHasuraServerUrl,
  networkIds,
} from "config/networks";
import { BigNumber } from "packages/ethers";
import { fetchQuery } from "utils/graphql";
import { createGameMutation, updateGameMutation } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import {
  IAuthToken,
  ICollection,
  IGame,
  IUserInfo,
  NetworkId,
} from "utils/types";
interface IAssetHistoryResponseRecord {
  erc20: string;
  erc20Amount: any;
  id: string;
  owner: string;
  timestamp: number;
  txHash: string;
}

export class APIService {
  private readonly serverEndPoint: string;
  private readonly backendUrl: string;
  private readonly _rateLimit: () => Promise<void>;

  private readonly cryptoContentPath = "/lock-content/v1/";
  private readonly gamePath = "/games/v1/";
  private readonly collectionPath = "/collections/v1/";
  private readonly assetPath = "/assets/v1/";
  private readonly userPath = "/users/v1/";
  private readonly commonPath = "/common/v1/";

  constructor(serverEndPoint: string, backendUrl: string) {
    this.serverEndPoint = serverEndPoint;
    this.backendUrl = backendUrl;
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
  public async createGame(payload: any, authToken: IAuthToken): Promise<IGame> {
    await this._rateLimit();
    const response = (
      await fetchQuery(createGameMutation, { payload }, this.serverEndPoint, {
        Authorization: `Bearer ${authToken.jwt_token}`,
      })
    ).data;

    if (response.data && response.data.createGame) {
      const gameObj: any = toCamelCaseObj(response.data.createGame);

      return gameObj as IGame;
    }
    throw new Error("Something went wrong!");
  }

  /**
   * Games
   * create Game
   */
  public async updateGame(
    id: string,
    payload: any,
    authToken: IAuthToken
  ): Promise<IGame> {
    await this._rateLimit();
    const response = (
      await fetchQuery(
        updateGameMutation,
        { id, payload },
        this.serverEndPoint,
        {
          Authorization: `Bearer ${authToken.jwt_token}`,
        }
      )
    ).data;

    if (response.data && response.data.updateGame) {
      const gameObj: any = toCamelCaseObj(response.data.updateGame);

      return gameObj as IGame;
    }
    throw new Error("Something went wrong!");
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
      `${this.backendUrl}${this.commonPath}check-custom-url-usable`,
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

const apiServices: { [key in NetworkId]: APIService } = {
  [networkIds.AVAXTEST]: new APIService(
    getHasuraServerUrl(networkIds.AVAXTEST).httpUri,
    getBackendServiceUri(networkIds.AVAXTEST)
  ),
  [networkIds.AVAXMAIN]: new APIService(
    getHasuraServerUrl(networkIds.AVAXMAIN).httpUri,
    getBackendServiceUri(networkIds.AVAXMAIN)
  ),
};

export const getAPIService = (networkId?: number) => {
  return apiServices[(networkId || DEFAULT_NETWORK_ID) as NetworkId];
};
