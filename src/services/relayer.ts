import {
  HttpClient,
  OrderConfigRequest,
  OrderConfigResponse,
  SignedOrder,
} from "@0x/connect";
import { assetDataUtils } from "@0x/order-utils";
import { Orderbook } from "@0x/orderbook";
import { BigNumber } from "@0x/utils";
import { RateLimit } from "async-sema";
import { RELAYER_RPS, RELAYER_URL, RELAYER_WS_URL } from "config/constants";
import { networkIds } from "config/networks";
import { tokenAmountInUnitsToBigNumber } from "utils/token";
import { IToken, NetworkId } from "utils/types";

export class Relayer {
  private readonly _client: HttpClient;
  private readonly _rateLimit: () => Promise<void>;
  private readonly _orderbook: Orderbook;

  public readonly networkId: NetworkId;

  constructor(options: { networkId: NetworkId }) {
    this.networkId = options.networkId;
    this._orderbook = Orderbook.getOrderbookForWebsocketProvider({
      httpEndpoint: RELAYER_URL[options.networkId],
      websocketEndpoint: RELAYER_WS_URL[options.networkId],
    });
    this._client = new HttpClient(RELAYER_URL[options.networkId]);
    this._rateLimit = RateLimit(RELAYER_RPS); // requests per second
  }

  public async getAllOrdersAsync(
    baseTokenAssetData: string,
    quoteTokenAssetData: string
  ): Promise<SignedOrder[]> {
    const [sellOrders, buyOrders] = await Promise.all([
      this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData),
      this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData),
    ]);
    return [...sellOrders, ...buyOrders];
  }

  public async getOrderConfigAsync(
    orderConfig: OrderConfigRequest
  ): Promise<OrderConfigResponse> {
    await this._rateLimit();
    return this._client.getOrderConfigAsync(orderConfig);
  }

  public async getUserOrdersAsync(
    account: string,
    baseTokenAssetData: string,
    quoteTokenAssetData: string
  ): Promise<SignedOrder[]> {
    const [sellOrders, buyOrders] = await Promise.all([
      this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData, account),
      this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData, account),
    ]);

    return [...sellOrders, ...buyOrders];
  }

  public async getCurrencyPairPriceAsync(
    baseToken: IToken,
    quoteToken: IToken
  ): Promise<BigNumber | null> {
    const asks = await this._getOrdersAsync(
      assetDataUtils.encodeERC20AssetData(baseToken.address),
      assetDataUtils.encodeERC20AssetData(quoteToken.address)
    );

    if (asks.length) {
      const lowestPriceAsk = asks[0];

      const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk;
      const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(
        takerAssetAmount,
        quoteToken.decimals
      );
      const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(
        makerAssetAmount,
        baseToken.decimals
      );
      return takerAssetAmountInUnits.div(makerAssetAmountInUnits);
    }

    return null;
  }

  public async submitOrderAsync(order: SignedOrder): Promise<void> {
    await this._rateLimit();
    return this._client.submitOrderAsync(order);
  }

  private async _getOrdersAsync(
    makerAssetData: string,
    takerAssetData: string,
    makerAddress?: string
  ): Promise<SignedOrder[]> {
    const apiOrders = await this._orderbook.getOrdersAsync(
      makerAssetData,
      takerAssetData
    );
    const orders = apiOrders.map((o) => o.order);
    if (makerAddress) {
      return orders.filter((o) => o.makerAddress === makerAddress);
    } else {
      return orders;
    }
  }
}

const relayers: { [key in NetworkId]: Relayer } = {
  [networkIds.AVAXTEST]: new Relayer({ networkId: networkIds.AVAXTEST }),
  [networkIds.AVAXMAIN]: new Relayer({ networkId: networkIds.AVAXMAIN }),
};

export const getRelayer = ({
  networkId,
}: {
  networkId: NetworkId;
}): Relayer => {
  return relayers[networkId];
};
