import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { BigNumber } from "ethers";
import { EBrowseGameBidItemStatus, EFarmingTag, EPlatform } from "./enums";
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

export interface IAssetItem {
  id: string;
  name: string;
  image: string;
  usdPrice: number;
  gswapPrice: BigNumber;
  priceChange: number;
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

export type Maybe<T> = T | null;

export type KnownToken = "gswap";

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    gswap: string;
  };
}

export type NetworkId = 1 | 4;

export type KnownContracts = keyof INetwork["contracts"];

export interface IKnownTokenData {
  symbol: string;
  decimals: number;
  addresses: {
    [K in NetworkId]?: string;
  };
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