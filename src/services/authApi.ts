import { RateLimit } from "async-sema";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getAuthServiceUri, networkIds } from "config/networks";
import { fetchQuery } from "utils/graphql";
import { connectQuery } from "utils/queries";
import { IAuthToken, NetworkId } from "utils/types";

class AuthApiService {
  private readonly _rateLimit: () => Promise<void>;

  private readonly authApiUri: string;

  constructor(apiUri: string) {
    this._rateLimit = RateLimit(20);
    this.authApiUri = apiUri;
  }

  async connect(message: string, signedMessage: string) {
    await this._rateLimit();
    const response = await fetchQuery(
      connectQuery,
      {
        message,
        signedMessage,
      },
      this.authApiUri
    );
    const token = response.data.data.signIn;
    return {
      ...token,
      expires_at: Date.now() + token.jwt_expires_in - 20 * 1000,
    } as IAuthToken;
  }
}

const authApiServices: {
  [key in NetworkId]: AuthApiService;
} = {
  [networkIds.AVAXMAIN]: new AuthApiService(
    getAuthServiceUri(networkIds.AVAXMAIN)
  ),
  [networkIds.AVAXTEST]: new AuthApiService(
    getAuthServiceUri(networkIds.AVAXTEST)
  ),
};

export const getAuthService = (networkId?: number): AuthApiService => {
  return authApiServices[(networkId || DEFAULT_NETWORK_ID) as NetworkId];
};
