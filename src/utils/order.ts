import { OrderConfigRequest } from "@0x/connect";
import { Order, SignedOrder, assetDataUtils } from "@0x/order-utils";
import { BigNumber } from "ethers";

import { ESellBuy } from "./enums";

interface BuildSellCollectibleOrderParams {
  collectibleAddress: string;
  collectibleId: BigNumber;
  account: string;
  amount: BigNumber;
  exchangeAddress: string;
  expirationDate: BigNumber;
  wethAddress: string;
  price: BigNumber;
}

export const buildSellCollectibleOrder = async (
  params: BuildSellCollectibleOrderParams,
  side: ESellBuy
) => {
  const {
    account,
    amount,
    collectibleAddress,
    collectibleId,
    exchangeAddress,
    expirationDate,
    price,
    wethAddress,
  } = params;
  const collectibleData = assetDataUtils.encodeERC721AssetData(
    collectibleAddress,
    collectibleId
  );
  const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

  const round = (num: BigNumber): BigNumber =>
    num.integerValue(BigNumber.ROUND_FLOOR);
  const orderConfigRequest: OrderConfigRequest = {
    exchangeAddress,
    makerAssetData: collectibleData,
    takerAssetData: wethAssetData,
    makerAssetAmount:
      side === OrderSide.Buy ? round(amount.multipliedBy(price)) : amount,
    takerAssetAmount:
      side === OrderSide.Buy ? amount : round(amount.multipliedBy(price)),
    makerAddress: account,
    takerAddress: ZERO_ADDRESS,
    expirationTimeSeconds: expirationDate,
  };
};
