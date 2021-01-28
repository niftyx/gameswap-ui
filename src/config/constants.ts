import { ReactComponent as MacIcon } from "assets/svgs/mac.svg";
import { ReactComponent as WindowsIcon } from "assets/svgs/windows.svg";
import { BigNumber, ethers } from "ethers";
import {
  EActivityType,
  EBrowseGameBidItemStatus,
  EFarmingTag,
  EFileType,
  EPlatform,
} from "utils/enums";
import {
  IActivityItem,
  IAssetItem,
  IBrowseGameBidItem,
  ICollection,
  IFeaturedFarmItem,
  IGame,
  IGameCategory,
  IIPFSConfig,
  IPriceFilterItem,
  IUpcomingFarmItem,
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
  host: process.env.REACT_APP_IPFS_HOST || "",
  port: Number(process.env.REACT_APP_IPFS_PORT || "5001"),
  protocol: process.env.REACT_APP_IPFS_PROTOCOL || "",
};

export const GRAPH_MAINNET_HTTP =
  process.env.REACT_APP_GRAPH_MAINNET_HTTP || "";
export const GRAPH_MAINNET_WS = process.env.REACT_APP_GRAPH_MAINNET_WS || "";
export const GRAPH_KOVAN_HTTP = process.env.REACT_APP_GRAPH_KOVAN_HTTP || "";
export const GRAPH_KOVAN_WS = process.env.REACT_APP_GRAPH_KOVAN_WS || "";

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID || "";

export const FEE_RECIPIENT_ADDRESS =
  process.env.REACT_APP_FEE_RECIPIENT_ADDRESS || "";

export const RELAYER_URL: { [key in NetworkId]: string } = {
  1: process.env.REACT_APP_RELAYER_URL_MAINNET || "",
  42: process.env.REACT_APP_RELAYER_URL_KOVAN || "",
};
export const RELAYER_WS_URL: { [key in NetworkId]: string } = {
  1: process.env.REACT_APP_RELAYER_WS_URL_MAINNET || "",
  42: process.env.REACT_APP_RELAYER_WS_URL_KOVAN || "",
};

export const RELAYER_RPS = Number(process.env.REACT_APP_RELAYER_RPS);

export const TokenEthereum = {
  decimals: 18,
  symbol: "ETH",
  name: "Ethereum",
};

export const TokenGswap = {
  decimals: 18,
  symbol: "GSWAP",
  name: "Gameswap",
};

export const SALE_TOKENS = [TokenEthereum, TokenGswap];

export const INVENTORY_PAGE_ASSET_COUNT = 20;
export const BROWSE_PAGE_ASSET_COUNT = 20;

export const ORDERS_PAGE_COUNT = 20;

export const PROTOCOL_FEE_MULTIPLIER = 70000;

export const MOCK_ASSET_ITEMS: IAssetItem[] = [
  {
    id: "Test",
    name: "JetPlane",
    image: "/svgs/mock/1.svg",
    usdPrice: 7240,
    priceChange: -0.127,
    imageType: EFileType.Image,
  },
  {
    id: "234",
    name: "JetPlane",
    image: "/svgs/mock/2.svg",
    usdPrice: 7240,
    priceChange: -0.127,
    imageType: EFileType.Image,
  },
  {
    id: "wefwf",
    name: "JetPlane",
    image: "/svgs/mock/3.svg",
    usdPrice: 7240,
    priceChange: -0.127,
    imageType: EFileType.Image,
  },
  {
    id: "wvwv",
    name: "JetPlane",
    image: "/svgs/mock/4.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
  {
    id: "lulul",
    name: "JetPlane",
    image: "/svgs/mock/5.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,

    priceChange: -0.127,
  },
  {
    id: "xvxv",
    name: "JetPlane",
    image: "/svgs/mock/6.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
  {
    id: "6i6i",
    name: "JetPlane",
    image: "/svgs/mock/7.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
  {
    id: "xvxvxvxv",
    name: "JetPlane",
    image: "/svgs/mock/8.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
  {
    id: "jtjtjsf",
    name: "JetPlane",
    image: "/svgs/mock/9.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
  {
    id: "fwfgerh",
    name: "JetPlane",
    image: "/svgs/mock/10.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
  {
    id: "bxbxb",
    name: "JetPlane",
    image: "/svgs/mock/11.svg",
    usdPrice: 7240,
    imageType: EFileType.Image,
    priceChange: -0.127,
  },
];

export const MockFeaturedFarms: IFeaturedFarmItem[] = [
  {
    id: "292934",
    title: "Dead by Daylight",
    description: "First asymmetrical multiplayer horror game.",
    tokenDescription: "ERC-20 / ERC-721",
    isFavorite: true,
    backgroundImage: "/images/backgrounds/daylight.png",
  },
  {
    id: "292vvv",
    title: "Resident Evil 2",
    description: "Continuation of the hit previously released - Resident Evil",
    tokenDescription: "ERC-721",
    isFavorite: true,
    backgroundImage: "/images/backgrounds/resident.png",
  },
  {
    id: "29wfe4",
    title: "Battlefield V",
    description: "Play the demo version!",
    tokenDescription: "ERC-1555",
    isFavorite: false,
    backgroundImage: "/images/backgrounds/battlefield.png",
  },
];

export const MockUpcomingFarms: IUpcomingFarmItem[] = [
  {
    id: "289234",
    title: "Just Cause 4",
    tags: [EFarmingTag.Simulation],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-20",
    image: "/svgs/upcoming/1.svg",
  },
  {
    id: "bwer24",
    title: "BatMan: Arkham Collection",
    tags: [EFarmingTag.Driving],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-1155",
    image: "/svgs/upcoming/2.svg",
  },
  {
    id: "wf2424",
    title: "DarkSiders III Blades & Whip Edition",
    tags: [EFarmingTag.Soccer],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-721",
    image: "/svgs/upcoming/3.svg",
  },
  {
    id: "hntn35",
    title: "Just Cause 4",
    tags: [EFarmingTag.Simulation],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-20",
    image: "/svgs/upcoming/1.svg",
  },
  {
    id: "neg35",
    title: "BatMan: Arkham Collection",
    tags: [EFarmingTag.Driving],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-1155",
    image: "/svgs/upcoming/2.svg",
  },
  {
    id: "3gt3t",
    title: "DarkSiders III Blades & Whip Edition",
    tags: [EFarmingTag.Soccer],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-721",
    image: "/svgs/upcoming/3.svg",
  },
  {
    id: "vxvwfwf",
    title: "Just Cause 4",
    tags: [EFarmingTag.Simulation],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-20",
    image: "/svgs/upcoming/1.svg",
  },
  {
    id: "hrhrhrh",
    title: "BatMan: Arkham Collection",
    tags: [EFarmingTag.Driving],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-1155",
    image: "/svgs/upcoming/2.svg",
  },
  {
    id: "bnwfwf",
    title: "DarkSiders III Blades & Whip Edition",
    tags: [EFarmingTag.Soccer],
    platforms: [EPlatform.Windows, EPlatform.Mac],
    tokenDescription: "ERC-721",
    image: "/svgs/upcoming/3.svg",
  },
];

export const MOCK_PROFILE_ACTIVITIES: IActivityItem[] = [
  {
    id: "hjiwor24",
    image: "/svgs/activity/cyberAssault.svg",
    title: "Skin Weapon",
    type: EActivityType.Buy,
    address: "0xaac41ec512808d64625576eddd580e7ea40ef8b2",
    trustPoints: 2,
    txHash:
      "0x22d2865291e1c25c430e3d555d0a5b6384a42b4314d24ba30335944d5005d15b",
  },
  {
    id: "bw452",
    image: "/svgs/activity/skyfall.svg",
    title: "OF COURSE I HATE YOU DESTRUCTOR SHIP ",
    type: EActivityType.Bid,
    address: "0xaac41ec512808d64625576eddd580e7ea40ef8b2",
    trustPoints: 2,
    txHash:
      "0x22d2865291e1c25c430e3d555d0a5b6384a42b4314d24ba30335944d5005d15b",
  },
  {
    id: "kuylgsf",
    image: "/svgs/activity/fortnite.svg",
    title: "Marshemello DJ Wear",
    type: EActivityType.Sale,
    address: "0xaac41ec512808d64625576eddd580e7ea40ef8b2",
    trustPoints: 2,
    txHash:
      "0x22d2865291e1c25c430e3d555d0a5b6384a42b4314d24ba30335944d5005d15b",
  },
  {
    id: "vxzvwr",
    image: "/svgs/activity/mars.svg",
    title: "MARS Base",
    type: EActivityType.Buy,
    address: "0xaac41ec512808d64625576eddd580e7ea40ef8b2",
    trustPoints: 2,
    txHash:
      "0x22d2865291e1c25c430e3d555d0a5b6384a42b4314d24ba30335944d5005d15b",
  },
];

export const PLATFORM_ICONS: { [key: string]: React.ElementType } = {
  WINDOWS: WindowsIcon,
  MAC: MacIcon,
};

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

export const GAMES: IGame[] = [
  {
    id: "1",
    title: "Skyfall",
    version: "3",
    imageUrl: "...",
    category: GAME_CATEGORIES[2],
    description: "test des",
    platform: [
      { os: "windows", version: "10" },
      { os: "mac", version: "10.13.6" },
    ],
  },
  {
    id: "2",
    title: "Cyberpunk Assault",
    version: "1.1",
    imageUrl: "...",
    category: GAME_CATEGORIES[3],
    description: "test des",
    platform: [
      { os: "windows", version: "10" },
      { os: "mac", version: "10.13.6" },
    ],
  },
  {
    id: "3",
    title: `No Man's Sky`,
    version: "1.2",
    imageUrl: "...",
    category: GAME_CATEGORIES[4],
    description: "test nnn",
    platform: [
      { os: "windows", version: "10" },
      { os: "mac", version: "10.13.6" },
    ],
  },
  {
    id: "4",
    title: "Horizon Zero Dawn",
    version: "1.2",
    imageUrl: "...",
    category: GAME_CATEGORIES[5],
    description: "test horizon",
    platform: [
      { os: "windows", version: "10" },
      { os: "mac", version: "10.13.6" },
    ],
  },
];

export const GSWAP_COLLECTION: ICollection = {
  id: "1",
  displayName: "Gameswap721",
  description: "GameSwap Collection",
  imageUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnH4_d12NJiVZLkPeU0DcPuVNRWisZPWTFWg&usqp=CAU",
};
