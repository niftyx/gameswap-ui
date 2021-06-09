import { SignedOrder } from "@0x/types";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { knownTokens } from "config/networks";
import { BigNumber } from "packages/ethers";

import { EMembership, THEME } from "./enums";

import {
  EBrowseGameBidItemStatus,
  EFarmingTag,
  EFileType,
  EHistoryItemType,
  EPlatform,
  ESortDirection,
  ETradeType,
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
        eleventh: string;
        twelfth: string;
        thirteenth: string;
        preview: string;
        gradient1: string;
        gradient2: string;
        gradient3: string;
        gradient4: string;
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
        heart: string;
      };
      shadow: {
        modal: string;
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
        eleventh: string;
        twelfth: string;
        thirteenth: string;
        preview: string;
        gradient1: string;
        gradient2: string;
        gradient3: string;
        gradient4: string;
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
        heart: string;
      };
      shadow: {
        modal: string;
      };
    };
  }
}

interface ISettings {
  theme: THEME;
  responsiveFontSizes: boolean;
  autoplay: boolean;
}

interface ITokenAmount {
  amount: BigNumber;
  token: IToken;
}

interface IAssetItem {
  id: string;
  collectionId: string;
  tokenId: BigNumber;
  tokenURL: string;
  name: string;
  description?: string;
  image: string;
  imageType: EFileType;
  rar?: string;
  createTimeStamp: number;
  royalties?: number;
  attributes?: IAssetAttribute[];
  price?: ITokenAmount;
  prices?: ITokenAmount[];
  isInSale?: boolean;
  maxOrder?: ISignedOrder;
  orders?: ISignedOrder[];
  bids?: ISignedOrder[];
  owner: string;
  contentId?: string;
  gameId?: string;
  lockedData?: string;
  creator?: string;
}

interface ISideMenuGroupHeaderItem {
  title: string;
  className?: string;
  moreItems?: IMoreItem[];
}

interface ISideMenuItem {
  title: string;
  className?: string;
  Icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  auth?: boolean;
}

interface IGameItem {
  id: string;
  title: string;
  backgroundImage?: string;
}

interface IFeaturedFarmItem {
  id: string;
  title: string;
  description: string;
  tokenDescription: string;
  isFavorite: boolean;
  backgroundImage?: string;
}

interface IUpcomingFarmItem {
  id: string;
  image?: string;
  title: string;
  tags: EFarmingTag[];
  platforms: EPlatform[];
  tokenDescription: string;
}

interface IBrowseGameBidItem {
  id: string;
  image?: string;
  name: string;
  offers: number;
  startFromAmount: BigNumber;
  startFromToken: string;
  status: EBrowseGameBidItemStatus;
}

interface INavToolbarItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

interface IPriceFilterItem {
  amount: number;
  price: number;
}

interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  image?: string;
  volume?: string;
  coingeckoTokenId: string;
}

interface IERC721Token {
  address: string;
  symbol: string;
  name: string;
  image?: string;
  volume?: string;
}

type Maybe<T> = T | null;

type KnownToken = "gswap" | "shroom" | "wavax";

interface INetwork {
  label: string;
  url: string;
  contracts: {
    erc721Factory: string;
  };
  etherscanUri: string;
  authService: string;
  hasuraService: string;
}

type NetworkId = 43113 | 43114;

type KnownContracts = keyof INetwork["contracts"];

interface IKnownTokenData {
  symbol: string;
  decimals: number;
  addresses: {
    [K in NetworkId]?: string;
  };
  coingeckoTokenId: string;
}

interface I0xContractAddresses {
  exchange: string;
  erc20Proxy: string;
  erc721proxy: string;
  devUtils: string;
  forwarder: string;
}

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
  }
}

interface IFaqNavBarItem {
  id: string;
  title: string;
  href?: string;
  children?: IFaqNavBarItem[];
}

interface IGlobalPriceData {
  usd: number;
  price: BigNumber;
  decimals: number;
}
interface IGlobalData {
  itemCartIds: string[];
  inventoryCartIds: string[];
  price: { [key in KnownToken]: IGlobalPriceData };
  collections: ICollection[];
  games: IGame[];
  userInfo?: IUserInfo;
}

interface IIPFSConfig {
  host: string;
  port: number;
  protocol: string;
}

interface ITradeData {
  asset?: IAssetItem | null;
  mode: ETradeType;
  bid?: ISignedOrder | null;
}

interface ISignedOrder extends SignedOrder {
  erc721Address: string;
  erc20Address: string;
  assetId: BigNumber;
}

interface ITradeAssetItem {
  id: BigNumber;
  collectionId: string;
  orders: ISignedOrder[];
}

interface IAssetAttribute {
  key: string;
  value: string;
}

interface IHistoryItem {
  id: string;
  timestamp: number;
  from: string;
  to?: string;
  type: EHistoryItemType;
  price?: { tokenAddress: string; amount: BigNumber };
  txHash?: string;
}

interface IIpfsMainData {
  attributes: IAssetAttribute[];
  description?: string;
  image: string;
  imageType: EFileType;
  name: string;
  rar?: string;
  royalties: number;
}

interface IGameCategory {
  value: string;
  name: string;
}

interface IGame {
  id: string;
  name: string;
  version: string;
  imageUrl: string;
  headerImageUrl?: string;
  categoryId: string;
  description: string;
  platform: EPlatform;
  customUrl: string;
  owner?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  isPremium?: boolean;
  collections?: ICollection[];
}

interface ICollection {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  symbol: string;
  isPrivate: boolean;
  totalSupply?: BigNumber;
  totalBurned?: BigNumber;
  totalMinted?: BigNumber;
  owner?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  isPremium?: boolean;
  gameIds: string[];
  games?: IGame[];
}
interface IBalances {
  eth: BigNumber;
  erc20Balances: {
    [key in KnownToken]: BigNumber;
  };
}

interface IUserInfo {
  name: string;
  address: string;
  id: string;
  customUrl: string;
  bio: string;
  twitterUsername: string;
  twitterVerified: boolean;
  twitchUsername: string;
  facebookUsername: string;
  youtubeUsername: string;
  instagramUsername: string;
  tiktokUsername: string;
  personalSite: string;
  imageUrl: string;
  headerImageUrl: string;
}

interface ICollectionFormValues extends ICollection {
  image: File | null;
  uploading: boolean;
}

// game create
interface IGameFormValues extends IGame {
  image: File | null;
  imageUploading: boolean;
  headerImage: File | null;
  headerImageUploading: boolean;
  customUrlVerified: boolean;
  customUrlVerifying: boolean;
}

interface IInventoryFilter {
  gameId?: string;
  collectionId?: string;
}

interface ITradeSectionFilter {
  sortDir?: ESortDirection;
}

interface ITradeFilter {
  priceEnabled: boolean;
  priceMin?: number;
  priceMax?: number;
  statusEnabled: boolean;
  statuses?: EOrderStatus[];
  collectionEnabled: boolean;
  collectionIds?: string[];
  saleCurrencyEnabled: boolean;
  currencies?: KnownToken[];
  membership: EMembership;
  platformEnabled: boolean;
  platforms?: EPlatform[];
}

interface IAuthToken {
  jwt_token: string;
  jwt_expires_in: number;
  expires_at: number;
}
