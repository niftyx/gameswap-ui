import { BigNumber } from "ethers";
import { IAssetItem } from "utils/types";

export const STORAGE_KEY_SETTINGS = "settings";

export const MOCK_ASSET_ITEMS: IAssetItem[] = [
  {
    id: "Test",
    name: "JetPlane",
    image: "/svgs/mock/1.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "234",
    name: "JetPlane",
    image: "/svgs/mock/2.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "wefwf",
    name: "JetPlane",
    image: "/svgs/mock/3.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "wvwv",
    name: "JetPlane",
    image: "/svgs/mock/4.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "lulul",
    name: "JetPlane",
    image: "/svgs/mock/5.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "xvxv",
    name: "JetPlane",
    image: "/svgs/mock/6.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "6i6i",
    name: "JetPlane",
    image: "/svgs/mock/7.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
];
