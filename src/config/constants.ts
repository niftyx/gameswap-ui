import { ReactComponent as MacIcon } from "assets/svgs/mac.svg";
import { ReactComponent as WindowsIcon } from "assets/svgs/windows.svg";
import { BigNumber } from "ethers";
import { EFarmingTag, EPlatform } from "utils/enums";
import { IAssetItem, IFeaturedFarmItem, IUpcomingFarmItem } from "utils/types";

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
    backgroundImage: "/svgs/backgrounds/daylight.svg",
  },
  {
    id: "292vvv",
    title: "Resident Evil 2",
    description: "Continuation of the hit previously released - Resident Evil",
    tokenDescription: "ERC-721",
    isFavorite: true,
    backgroundImage: "/svgs/backgrounds/resident.svg",
  },
  {
    id: "29wfe4",
    title: "Battlefield V",
    description: "Play the demo version!",
    tokenDescription: "ERC-1555",
    isFavorite: false,
    backgroundImage: "/svgs/backgrounds/battlefield.svg",
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

export const PLATFORM_ICONS: { [key: string]: React.ElementType } = {
  WINDOWS: WindowsIcon,
  MAC: MacIcon,
};
