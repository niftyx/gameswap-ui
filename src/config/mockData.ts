import { BigNumber } from "packages/ethers";
import { IGraphInventoryAsset } from "types";

export const Mock_Graph_Inventory_Assets: IGraphInventoryAsset[] = [
  {
    // assetId: "0x01",
    assetId: BigNumber.from(1),
    assetUrl:
      "https://ipfs.niftyx.org/ipfs/QmfRehfAYwSeBnDcPw64W3ncsoq9mprWHX1pbC5LiHrvtU",
    collectionId: "0x4b8f34153b982bf352b075b26aa5c9a799fa2197",
    contentId: "",
    createTimeStamp: 1624366414,
    creatorId: "0x2e84741f27e2993d637f3a537191101ccbf67050",
    id: "0x211487401eed3126f7fe7e68101957d45adf0988dd5483986c1ce7b5120d0149",
    ownerId: "0x6e630daad34810c5d897900d0c6b432918d8d775",
    updateTimeStamp: 1624366414,
  },
];
