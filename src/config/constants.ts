import { ReactComponent as AndroidIcon } from "assets/svgs/platform/android.svg";
import { ReactComponent as IOSIcon } from "assets/svgs/platform/ios.svg";
import { ReactComponent as LinuxIcon } from "assets/svgs/platform/linux.svg";
import { ReactComponent as MacIcon } from "assets/svgs/platform/mac.svg";
import { ReactComponent as WebIcon } from "assets/svgs/platform/web.svg";
import { ReactComponent as WindowsIcon } from "assets/svgs/platform/windows.svg";
import { BigNumber, ethers } from "packages/ethers";
import { EBrowseGameBidItemStatus } from "utils/enums";
import {
  IBrowseGameBidItem,
  IGameCategory,
  IIPFSConfig,
  IPriceFilterItem,
  NetworkId,
} from "utils/types";

export const STORAGE_KEY_SETTINGS = "settings";
export const STORAGE_KEY_CONNECTOR = "CONNECTOR";
export const LOGGER_ID = "gameswap";

export const PRICE_FILTER_COLUMN_COUNT = 20;
export const PRICE_DECIMALS = 18;
export const DEFAULT_USD = Number(0);
export const DEFAULT_PRICE = ethers.utils.parseUnits(
  DEFAULT_USD.toString(),
  PRICE_DECIMALS
);

export const SERVICE_FEE = Number(process.env.REACT_APP_SERVICE_FEE);
export const SERVICE_FEE_IN_PERCENT = SERVICE_FEE * 100;

export const TX_DEFAULTS = {
  gas: 1000000,
};

export const IPFS_CONFIG: IIPFSConfig = {
  host: "ipfs.niftyx.org",
  port: 443,
  protocol: "https",
};

export const RELAYER_URL: { [key in NetworkId]: string } = {
  43113: process.env.REACT_APP_RELAYER_URL_AVAXTEST || "",
  43114: process.env.REACT_APP_RELAYER_URL_AVAXMAIN || "",
};
export const RELAYER_WS_URL: { [key in NetworkId]: string } = {
  43113: process.env.REACT_APP_RELAYER_WS_URL_AVAXTEST || "",
  43114: process.env.REACT_APP_RELAYER_WS_URL_AVAXMAIN || "",
};

export const API_BASE_URL = process.env.REACT_APP_API || "";

export const DEFAULT_NETWORK_ID = 43113;

export const RELAYER_RPS = Number(process.env.REACT_APP_RELAYER_RPS);

export const FLEEK_API_KEY = process.env.REACT_APP_FLEEK_API_KEY || "";
export const FLEEK_API_SECRET = process.env.REACT_APP_FLEEK_API_SECRET || "";
export const FLEEK_IPFS_BASE_URL = "https://ipfs.fleek.co/ipfs/";

export const TokenAvax = {
  decimals: 18,
  symbol: "AVAX",
  name: "Avalanche",
};

export const INVENTORY_PAGE_ASSET_COUNT = 50;
export const BROWSE_PAGE_ASSET_COUNT = 50;
export const ORDERS_PAGE_COUNT = 10;

export const AssetProxyIds = {
  erc721: "0x02571792",
  erc20: "0xf47261b0",
};

export const PROTOCOL_FEE_MULTIPLIER = 70000;

export const PLATFORM_ICONS: { [key: string]: React.ElementType } = {
  Windows: WindowsIcon,
  Mac: MacIcon,
  Linux: LinuxIcon,
  Android: AndroidIcon,
  iOS: IOSIcon,
  Web: WebIcon,
};

export const BANNED_CUSTOM_URLS = [
  "trade",
  "assets",
  "games",
  "collections",
  "browse",
  "faq",
  "create",
  "users",
  "settings",
];

export const MOCK_AUCTIONS_ITEMS: IBrowseGameBidItem[] = [
  {
    id: "Test",
    name: "JetPlane",
    image: "/svgs/mock/1.svg",
    status: EBrowseGameBidItemStatus.FieldTested,
    offers: 23,
    startFromAmount: BigNumber.from("42"),
    startFromToken: "GSWAP",
  },
  {
    id: "Test1",
    name: "JetPlane",
    image: "/svgs/mock/2.svg",
    status: EBrowseGameBidItemStatus.FieldTested,
    offers: 23,
    startFromAmount: BigNumber.from("23"),
    startFromToken: "GSWAP",
  },
  {
    id: "Testfwe",
    name: "JetPlane",
    image: "/svgs/mock/3.svg",
    status: EBrowseGameBidItemStatus.FieldTested,
    offers: 23,
    startFromAmount: BigNumber.from("23"),
    startFromToken: "GSWAP",
  },
  {
    id: "gwf",
    name: "JetPlane",
    image: "/svgs/mock/4.svg",
    status: EBrowseGameBidItemStatus.FieldTested,
    offers: 23,
    startFromAmount: BigNumber.from("23"),
    startFromToken: "GSWAP",
  },
  {
    id: "zxv",
    name: "JetPlane",
    image: "/svgs/mock/5.svg",
    status: EBrowseGameBidItemStatus.FieldTested,
    offers: 23,
    startFromAmount: BigNumber.from("23"),
    startFromToken: "GSWAP",
  },
  {
    id: "bwfhrhrh",
    name: "JetPlane",
    image: "/svgs/mock/6.svg",
    status: EBrowseGameBidItemStatus.FieldTested,
    offers: 23,
    startFromAmount: BigNumber.from("23"),
    startFromToken: "GSWAP",
  },
];

export const MOCK_PRICE_FILTER_ITEMS: IPriceFilterItem[] = [
  {
    amount: 10,
    price: 10,
  },
  {
    amount: 4,
    price: 15,
  },
  {
    amount: 10,
    price: 14,
  },
  {
    amount: 10,
    price: 67,
  },
  {
    amount: 8,
    price: 35,
  },
  {
    amount: 5,
    price: 46,
  },
  {
    amount: 9,
    price: 90,
  },
  {
    amount: 4,
    price: 45,
  },
  {
    amount: 3,
    price: 44,
  },
  {
    amount: 8,
    price: 55,
  },
  {
    amount: 23,
    price: 22,
  },
  {
    amount: 10,
    price: 33,
  },
  {
    amount: 5,
    price: 88,
  },
  {
    amount: 10,
    price: 45,
  },
  {
    amount: 4,
    price: 99,
  },
  {
    amount: 3,
    price: 90,
  },
  {
    amount: 10,
    price: 97,
  },
];

export const ASSET_IMAGE_FILE_SIZE_LIMIT = 30 * 1024 * 1024; // 30MB
export const ASSET_ZIP_FILE_SIZE_LIMIT = 200 * 1024 * 1024; // 30MB

// To Do: add MMORGP below

export const GAME_CATEGORIES: IGameCategory[] = [
  { value: "0", name: "Action" },
  { value: "1", name: "Horror" },
  { value: "2", name: "Adventure" },
  { value: "3", name: "Fangame" },
  { value: "4", name: "Fnaf" },
  { value: "5", name: "RPG" },
  { value: "6", name: "Multiplayer" },
  { value: "7", name: "Platformer" },
  { value: "8", name: "Scifi" },
  { value: "9", name: "Retro" },
  { value: "10", name: "Point & Click" },
  { value: "11", name: "Shooter" },
  { value: "12", name: "Altgame" },
  { value: "13", name: "VR" },
  { value: "14", name: "Survival" },
  { value: "15", name: "Arcade" },
  { value: "16", name: "Roguelike" },
  { value: "17", name: "Puzzle" },
  { value: "18", name: "Strategy" },
  { value: "19", name: "Sports" },
  { value: "20", name: "Adult" },
  { value: "21", name: "Other" },
];

export const TEST_MODE = Boolean(Number(process.env.REACT_APP_TEST || "0"));

export const NETWORK_CONFIG = TEST_MODE
  ? {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xa869",
          chainName: "Avalanche Fuji Testnet",
          nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
          },
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://cchain.explorer.avax-test.network/"],
        },
      ],
    }
  : {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xa86a",
          chainName: "Avalanche Mainnet",
          nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
          },
          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
        },
      ],
    };
