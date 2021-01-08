import { SignedOrder } from "@0x/types";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { knownTokens } from "config/networks";
import { BigNumber } from "ethers";

import {
  EBrowseGameBidItemStatus,
  EFarmingTag,
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
  createTimeStamp?: number;
  usdPrice: number;
  priceChange: number;
  royalties?: number;
  attributes?: [{ [key: string]: string }];
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

export interface IItemDetails {
  id: string;
  collection: string;
  patternTemplate: string;
  finishCatalog: string;
  description: string;
  tags: string[];
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
}

export interface IERC721Token {
  address: string;
  symbol: string;
  name: string;
  image?: string;
  volume?: string;
}

export type Maybe<T> = T | null;

export type KnownToken = "gswap" | "weth";

export interface INetwork {
  label: string;
  url: string;
  graphHttpUri: string;
  graphWsUri: string;
  contracts: {
    gswap: string;
    erc721: string;
    weth: string;
  };
}

export type NetworkId = 1 | 42;

export type KnownContracts = keyof INetwork["contracts"];

export interface IKnownTokenData {
  symbol: string;
  decimals: number;
  addresses: {
    [K in NetworkId]?: string;
  };
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

export type IUSDPriceTokenSymbol = "gswap" | "weth";

export interface IGlobalData {
  itemCartIds: string[];
  inventoryCartIds: string[];
  price: {
    gswap: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
    weth: {
      usd: number;
      price: BigNumber;
      decimals: number;
    };
  };
}

export interface IIPFSConfig {
  host: string;
  port: number | string;
  protocol: string;
  preload?: { enabled: boolean };
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
