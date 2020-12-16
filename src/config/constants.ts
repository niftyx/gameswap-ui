import { ReactComponent as MacIcon } from "assets/svgs/mac.svg";
import { ReactComponent as WindowsIcon } from "assets/svgs/windows.svg";
import { BigNumber, ethers } from "ethers";
import {
  EActivityType,
  EBrowseGameBidItemStatus,
  EFarmingTag,
  EPlatform,
} from "utils/enums";
import {
  IActivityItem,
  IAssetItem,
  IBrowseGameBidItem,
  IFeaturedFarmItem,
  IIPFSConfig,
  IPriceFilterItem,
  IUpcomingFarmItem,
} from "utils/types";

export const STORAGE_KEY_SETTINGS = "settings";
export const STORAGE_KEY_CONNECTOR = "CONNECTOR";
export const LOGGER_ID = "gameswap";

export const PRICE_FILTER_COLUMN_COUNT = 20;
export const PRICE_DECIMALS = 10;
export const DEFAULT_USD = Number(0);
export const DEFAULT_PRICE = ethers.utils.parseUnits(
  DEFAULT_USD.toString(),
  PRICE_DECIMALS
);

export const SERVICE_FEE = Number(process.env.REACT_APP_SERVICE_FEE || 0.025);
export const SERVICE_FEE_IN_PERCENT = SERVICE_FEE * 100;

export const IPFS_CONFIG: IIPFSConfig = {
  host: process.env.REACT_APP_IPFS_HOST || "ipfs.infura.io",
  port: process.env.REACT_APP_IPFS_PORT || 5001,
  protocol: process.env.REACT_APP_IPFS_PROTOCOL || "https",
};

export const GRAPH_MAINNET_HTTP =
  process.env.REACT_APP_GRAPH_MAINNET_HTTP ||
  "https://api.thegraph.com/subgraphs/name/liaojikunwork/gameswapsubgraphkovan";
export const GRAPH_MAINNET_WS =
  process.env.REACT_APP_GRAPH_MAINNET_WS ||
  "https://api.thegraph.com/subgraphs/name/liaojikunwork/gameswapsubgraphkovan";
export const GRAPH_KOVAN_HTTP =
  process.env.REACT_APP_GRAPH_KOVAN_HTTP ||
  "https://api.thegraph.com/subgraphs/name/liaojikunwork/gameswapsubgraphkovan";
export const GRAPH_KOVAN_WS =
  process.env.REACT_APP_GRAPH_KOVAN_WS ||
  "https://api.thegraph.com/subgraphs/name/liaojikunwork/gameswapsubgraphkovan";

export const IPFS_IMAGE_ENDPOINT = `${IPFS_CONFIG.protocol}://${IPFS_CONFIG.host}:${IPFS_CONFIG.port}/api/v0/cat/`;

export const INFURA_PROJECT_ID =
  process.env.REACT_APP_INFURA_PROJECT_ID || "f9df69e5cfef48799e2d20eaa7d15697";

export const FEE_RECIPIENT_ADDRESS =
  process.env.REACT_APP_FEE_RECIPIENT_ADDRESS ||
  "0x18B13ef88822292E59bfF80210D815F7FBFC9b32";

export const RELAYER_URL =
  process.env.REACT_APP_RELAYER_URL || "https://sra.bamboorelay.com/0x/v3/";
export const RELAYER_WS_URL =
  process.env.REACT_APP_RELAYER_WS_URL || "wss://sra.bamboorelay.com/0x/v3/ws";

export const RELAYER_RPS = Number(process.env.REACT_APP_RELAYER_RPS || 5);

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

export const INVENTORY_PAGE_ASSET_COUNT = Number(
  process.env.REACT_APP_INVENTORY_PAGE_ASSET_COUNT || 20
);

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
  {
    id: "xvxvxvxv",
    name: "JetPlane",
    image: "/svgs/mock/8.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "jtjtjsf",
    name: "JetPlane",
    image: "/svgs/mock/9.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "fwfgerh",
    name: "JetPlane",
    image: "/svgs/mock/10.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
    priceChange: -0.127,
  },
  {
    id: "bxbxb",
    name: "JetPlane",
    image: "/svgs/mock/11.svg",
    usdPrice: 7240,
    gswapPrice: BigNumber.from("23"),
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
