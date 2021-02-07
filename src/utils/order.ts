import { DevUtilsContract, ExchangeContract } from "@0x/contract-wrappers";
import {
  Order,
  SignedOrder,
  assetDataUtils,
  signatureUtils,
} from "@0x/order-utils";
import { MetamaskSubprovider } from "@0x/subproviders";
import { OrderConfigRequest, ZeroExTransaction } from "@0x/types";
import { BigNumber } from "@0x/utils";
import {
  DEFAULT_NETWORK_ID,
  FEE_RECIPIENT_ADDRESS,
  ORDERS_PAGE_COUNT,
  PROTOCOL_FEE_MULTIPLIER,
  RELAYER_URL,
  SERVICE_FEE,
  TX_DEFAULTS,
} from "config/constants";
import { get0xContractAddresses } from "config/networks";
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
    feeRecipientAddress: FEE_RECIPIENT_ADDRESS,
    takerFeeAssetData: erc20AssetData,
    takerFee: new BigNumber(orderConfigRequest.takerAssetAmount).multipliedBy(
      new BigNumber(SERVICE_FEE)
    ),
  };

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
  const endPoint = `${
    RELAYER_URL[(networkId || DEFAULT_NETWORK_ID) as NetworkId]
  }/orders`;
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

export const calculateWorstCaseProtocolFee = (
  orders: SignedOrder[],
  gasPrice: BigNumber
): BigNumber => {
  const protocolFee = new BigNumber(
    orders.length * PROTOCOL_FEE_MULTIPLIER
  ).times(gasPrice);
  return protocolFee;
};

export const getTransactionOptions = (gasPrice: BigNumber) => {
  let options = {
    gasPrice,
  };

  if (process.env.NODE_ENV === "development") {
    options = {
      ...options,
      ...TX_DEFAULTS,
    };
  }

  return options;
};

export const submitBuyCollectible = async (
  provider: any,
  order: SignedOrder,
  account: string,
  gasPriceInWei: BigNumber,
  networkId: number
): Promise<string> => {
  const protocolFee = calculateWorstCaseProtocolFee([order], gasPriceInWei);

  const exchangeContract = new ExchangeContract(
    get0xContractAddresses(networkId).exchange,
    provider
  );

  const tx = await exchangeContract
    .fillOrder(order, order.takerAssetAmount, order.signature)
    .sendTransactionAsync({
      from: account,
      ...getTransactionOptions(gasPriceInWei),
      value: protocolFee,
    });

  return tx;
};

export const wrangeOrderResponse = (order: SignedOrder): SignedOrder => ({
  ...order,
  takerAssetAmount: new BigNumber(order.takerAssetAmount),
  makerAssetAmount: new BigNumber(order.makerAssetAmount),
});

export const cancelOrder = async (
  provider: any,
  order: SignedOrder,
  account: string,
  gasPriceInWei: BigNumber,
  networkId: number
) => {
  const exchangeContract = new ExchangeContract(
    get0xContractAddresses(networkId).exchange,
    provider
  );
  const cancelData = exchangeContract
    .cancelOrder(order)
    .getABIEncodedTransactionData();
  const makerCancelOrderTransactionSalt = new BigNumber(Date.now());
  // The maker signs the operation data (cancelOrder) with the salt
  const zeroExTransaction: ZeroExTransaction = {
    data: cancelData,
    salt: makerCancelOrderTransactionSalt,
    signerAddress: account,
    expirationTimeSeconds: getExpirationTimeOrdersFromConfig(),
    gasPrice: gasPriceInWei,
    domain: {
      chainId: networkId,
      verifyingContract: exchangeContract.address,
    },
  };
  const devUtils = new DevUtilsContract(
    get0xContractAddresses(networkId).devUtils,
    provider
  );
  const executeTransactionHex = await devUtils
    .getTransactionHash(
      zeroExTransaction,
      new BigNumber(networkId),
      exchangeContract.address
    )
    .callAsync();
  const makerCancelOrderSignatureHex = await signatureUtils.ecSignHashAsync(
    new MetamaskSubprovider(provider),
    executeTransactionHex,
    account
  );
  return exchangeContract
    .executeTransaction(zeroExTransaction, makerCancelOrderSignatureHex)
    .sendTransactionAsync({
      from: account,
      ...getTransactionOptions(gasPriceInWei),
    });
};
