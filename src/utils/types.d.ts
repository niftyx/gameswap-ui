import { SignedOrder } from "@0x/types";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { knownTokens } from "config/networks";
import { BigNumber } from "ethers";

import {
  EBrowseGameBidItemStatus,
  EFarmingTag,
  EFileType,
  EHistoryItemType,
  EPlatform,
  ESellBuy,
} from "./enums";
declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
      appHeaderItemHeight: React.CSSProperties["height"];
      pageToolbarHeight: React.CSSProperties["height"];
      appNavbarWidth: React.CSSProperties["width"];
      header: {
        navItem: {
          fontSize: React.CSSProperties["fontSize"];
          lineHeight: React.CSSProperties["lineHeight"];
          fontWeight: React.CSSProperties["fontWeight"];
        };
      };
    };
    colors: {
      transparent: string;
      border: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
        fifth: string;
        sixth: string;
      };
      icon: {
        active: string;
        disabled: string;
      };
      link: {
        default: string;
      };
      background: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
        fifth: string;
        sixth: string;
        seventh: string;
        eighth: string;
        ninth: string;
        tenth: string;
      };
      text: {
        default: string;
        secondary: string;
        third: string;
        fourth: string;
        sixth: string;
        seventh: string;
        positive: string;
        negative: string;
        arrowUp: string;
        arrowDown: string;
        error: string;
      };
      activity: {
        bg: {
          buy: string;
          bid: string;
          sale: string;
        };
        text: {
          buy: string;
          bid: string;
          sale: string;
        };
      };
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
      appHeaderItemHeight: React.CSSProperties["height"];
      pageToolbarHeight: React.CSSProperties["height"];
      appNavbarWidth: React.CSSProperties["width"];
      header: {
        navItem: {
          fontSize: React.CSSProperties["fontSize"];
          lineHeight: React.CSSProperties["lineHeight"];
          fontWeight: React.CSSProperties["fontWeight"];
        };
      };
    };
    colors: {
      transparent: string;
      border: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
        fifth: string;
        sixth: string;
      };
      icon: {
        active: string;
        disabled: string;
      };
      link: {
        default: string;
      };
      background: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
        fifth: string;
        sixth: string;
        seventh: string;
        eighth: string;
        ninth: string;
        tenth: string;
      };
      text: {
        default: string;
        secondary: string;
        third: string;
        fourth: string;
        sixth: string;
        seventh: string;
        positive: string;
        negative: string;
        arrowUp: string;
        arrowDown: string;
        error: string;
      };
      activity: {
        bg: {
          buy: string;
          bid: string;
          sale: string;
        };
        text: {
          buy: string;
          bid: string;
          sale: string;
        };
      };
    };
  }
}

export enum THEME {
  White = "WHITE",
  Black = "BLACK",
}

export interface ISettings {
  theme: THEME;
  responsiveFontSizes: boolean;
}

export interface ITokenAmount {
  amount: BigNumber;
  token: IToken;
}

export interface IAssetItem {
  id: string;
  tokenId?: BigNumber;
  tokenURL?: string;
  name: string;
  description?: string;
  image: string;
  imageType: EFileType;
  rar?: string;
  createTimeStamp?: number;
  usdPrice: number;
  priceChange: number;
  royalties?: number;
  attributes?: IAssetAttribute[];
  price?: ITokenAmount;
  prices?: ITokenAmount[];
  isInSale?: boolean;
  orders?: ISignedOrder[];
  owner?: string;
}

export interface ISideMenuGroupHeaderItem {
  title: string;
  className?: string;
  moreItems?: IMoreItem[];
}

export interface ISideMenuItem {
  title: string;
  className?: string;
  Icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

export interface IGameItem {
  id: string;
  title: string;
  backgroundImage?: string;
}

export interface IFeaturedFarmItem {
  id: string;
  title: string;
  description: string;
  tokenDescription: string;
  isFavorite: boolean;
  backgroundImage?: string;
}

export interface IUpcomingFarmItem {
  id: string;
  image?: string;
  title: string;
  tags: EFarmingTag[];
  platforms: EPlatform[];
  tokenDescription: string;
}

export interface IActivityItem {
  id: string;
  image?: string;
  title: string;
  type: EActivityTag;
  address: string;
  trustPoints: number;
  txHash: string;
}

export interface IBrowseGameBidItem {
  id: string;
  image?: string;
  name: string;
  offers: number;
  startFromAmount: BigNumber;
  startFromToken: string;
  status: EBrowseGameBidItemStatus;
}

export interface INavToolbarItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

export interface IPriceFilterItem {
  amount: number;
  price: number;
}

export interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  image?: string;
  volume?: string;
  coingeckoTokenId: string;
}

export interface IERC721Token {
  address: string;
  symbol: string;
  name: string;
  image?: string;
  volume?: string;
}

export type Maybe<T> = T | null;

export type KnownToken = "gswap" | "shroom" | "weth";

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    erc721Factory: string;
    erc721: string;
  };
  etherscanUri: string;
}

export type NetworkId = 43113 | 43114;

export type KnownContracts = keyof INetwork["contracts"];

export interface IKnownTokenData {
  symbol: string;
  decimals: number;
  addresses: {
    [K in NetworkId]?: string;
  };
  coingeckoTokenId: string;
}

export interface I0xContractAddresses {
  exchange: string;
  erc20Proxy: string;
  erc721proxy: string;
  devUtils: string;
}

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
  }
}

export interface IFaqNavBarItem {
  id: string;
  title: string;
  href?: string;
  children?: IFaqNavBarItem[];
}

export interface IGlobalData {
  itemCartIds: string[];
  inventoryCartIds: string[];
  price: {
    [key in KnownToken]: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
  };
  collections: ICollection[];
  games: IGame[];
}

export interface IIPFSConfig {
  host: string;
  port: number;
  protocol: string;
}

export interface ITradeData {
  asset?: IAssetItem | null;
  mode: ESellBuy;
}

export interface ISignedOrder extends SignedOrder {
  erc721Address: string;
  erc20Address: string;
  assetId: BigNumber;
}

export interface ITradeAssetItem {
  id: string;
  orders: ISignedOrder[];
}

export interface IAssetAttribute {
  key: string;
  value: string;
}

export interface IHistoryItem {
  id: string;
  timestamp: number;
  from: string;
  to?: string;
  type: EHistoryItemType;
  price?: { tokenAddress: string; amount: BigNumber };
  txHash?: string;
}

export interface IIpfsMainData {
  attributes: IAssetAttribute[];
  description?: string;
  image: string;
  imageType: EFileType;
  name: string;
  rar?: string;
  royalties: number;
}

export interface IGameCategory {
  value: string;
  name: string;
}

export interface IPlatform {
  os: string;
  version: string;
}

export interface IGame {
  id: string;
  title: string;
  version: string;
  imageUrl: string;
  categoryId: string;
  description: string;
  platform: IPlatform[];
}

export interface ICollection {
  id: string;
  displayName: string;
  description?: string;
  imageUrl: string;
  shortUrl?: string;
  symbol: string;
}
export interface IBalances {
  eth: BigNumber;
  erc20Balances: {
    [key in KnownToken]: BigNumber;
  };
}
