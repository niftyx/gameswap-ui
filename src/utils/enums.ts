export enum EFarmingTag {
  Simulation = "SIMULATION",
  Driving = "DRIVING",
  Soccer = "SOCCER",
}

export enum EPlatform {
  Mac = "Mac",
  Windows = "Windows",
  Linux = "Linux",
  Android = "Android",
  iOS = "iOS",
  Web = "Web",
}

export enum EProfileMarker {
  ProTrader = "PRO TRADER",
  Verified = "VERIFIED",
}

export enum EBrowseGameBidItemStatus {
  FieldTested = "Field Tested",
}

export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  WalletLink = "walletlink",
}

export enum ETradeType {
  Sell,
  Buy,
  PlaceBid,
}

export enum ETradeStep {
  // Sell
  InputPrice,
  ShowPrice,
  GetSellApproveInfo,
  SetSellApproval,
  SellAsset,
  // Buy
  SelectOrder,
  BuyGetApproveInfo,
  BuySetApproval,
  BuyAsset,
  // Cancel Order
  CancelOrder,
  // Result
  Success,
}

export enum EBidStep {
  InputPrice,
  GetApprovalInfo,
  SetApproval,
  PlaceBid,
  Success,
}

export enum EHistoryItemType {
  Created = "Created",
  // List = "List",
  Sale = "Sale",
  Transfer = "Transfer",
}

export enum EFileType {
  Image = "Image",
  Audio = "Audio",
  Video = "Video",
  Unknown = "Unknown",
}

export enum EProfileTab {
  Assets = "Assets",
  OnSale = "OnSale",
  Created = "Created",
  Liked = "Liked",
}

export enum EOrderStatus {
  BuyNow = "Buy Now",
  Auction = "Auction",
  New = "New",
  HasOffers = "Has Offers",
}

export enum EAssetDetailTab {
  Info = "Info",
  Owners = "Owners",
  History = "History",
  Details = "Details",
  Bids = "Bids",
}
