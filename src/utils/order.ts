import {
  Order,
  SignedOrder,
  assetDataUtils,
  signatureUtils,
} from "@0x/order-utils";
import { MetamaskSubprovider } from "@0x/subproviders";
import { OrderConfigRequest } from "@0x/types";
import { BigNumber } from "@0x/utils";
import {
  FEE_RECIPIENT_ADDRESS,
  ORDERS_PAGE_COUNT,
  RELAYER_URL,
} from "config/constants";
import { getRelayer } from "services/relayer";

import { getExpirationTimeOrdersFromConfig } from "./time-utils";
import { ZERO_ADDRESS } from "./token";
import { NetworkId } from "./types";

interface BuildSellCollectibleOrderParams {
  erc721: string;
  tokenId: BigNumber;
  account: string;
  amount: BigNumber;
  exchangeAddress: string;
  erc20Address: string;
  price: BigNumber;
}

export const buildSellCollectibleOrder = async (
  params: BuildSellCollectibleOrderParams,
  networkId: NetworkId,
  provider: any
) => {
  const {
    account,
    amount,
    erc20Address,
    erc721,
    exchangeAddress,
    price,
    tokenId,
  } = params;

  const collectibleData = assetDataUtils.encodeERC721AssetData(erc721, tokenId);
  const erc20AssetData = assetDataUtils.encodeERC20AssetData(erc20Address);

  const round = (num: BigNumber): BigNumber =>
    num.integerValue(BigNumber.ROUND_FLOOR);

  const orderConfigRequest: OrderConfigRequest = {
    exchangeAddress,
    makerAssetData: collectibleData,
    takerAssetData: erc20AssetData,
    makerAssetAmount: amount,
    takerAssetAmount: round(amount.multipliedBy(price)),
    makerAddress: account,
    takerAddress: ZERO_ADDRESS,
    expirationTimeSeconds: getExpirationTimeOrdersFromConfig(),
  };

  const client = getRelayer({ networkId });
  const orderResult = await client.getOrderConfigAsync(orderConfigRequest);

  const order: Order = {
    ...orderConfigRequest,
    ...orderResult,
    chainId: networkId,
    salt: new BigNumber(Date.now()),
  };

  // const order: Order = {
  //   exchangeAddress,
  //   makerAssetData: collectibleData,
  //   takerAssetData: erc20AssetData,
  //   makerAssetAmount: amount,
  //   takerAssetAmount: round(amount.multipliedBy(price)),
  //   makerAddress: account,
  //   takerAddress: ZERO_ADDRESS,
  //   expirationTimeSeconds: getExpirationTimeOrdersFromConfig(),
  //   chainId: networkId,
  //   salt: new BigNumber(Date.now()),
  //   feeRecipientAddress: FEE_RECIPIENT_ADDRESS,
  //   makerFee: new BigNumber(0),
  //   takerFee: new BigNumber(0),
  //   makerFeeAssetData: erc20AssetData,
  //   takerFeeAssetData: erc20AssetData,
  //   senderAddress: ZERO_ADDRESS,
  // };

  console.log("==order=before sign=", order);

  return signatureUtils.ecSignOrderAsync(
    new MetamaskSubprovider(provider),
    order,
    account
  );
};

export const submitCollectibleOrder = async (
  signedOrder: SignedOrder,
  networkId: NetworkId
) => {
  return getRelayer({ networkId }).submitOrderAsync(signedOrder);
};

export const buildOrdersQuery = (
  networkId: NetworkId,
  params: {
    makerAddress?: string;
    makerAssetProxyId?: string;
    takerAssetProxyId?: string;
    makerAssetAddress?: string;
    takerAssetAddress?: string;
    makerAssetData?: string;
    page?: number;
    perPage?: number;
  }
): string => {
  const endPoint = `${RELAYER_URL[(networkId || 1) as NetworkId]}/orders`;
  const {
    makerAssetProxyId = "0x02571792",
    page = 1,
    perPage = ORDERS_PAGE_COUNT,
    takerAssetProxyId = "0xf47261b0",
  } = params;
  const finalParams: { [key: string]: string | number | undefined } = {
    ...params,
    perPage,
    page,
    makerAssetProxyId,
    takerAssetProxyId,
  };
  const query = Object.keys(finalParams)
    .filter((key) => finalParams[key])
    .map((key) => `${key}=${encodeURIComponent(String(finalParams[key]))}`)
    .join("&");

  return `${endPoint}?${query}`;
};
