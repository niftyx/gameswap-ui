export enum EFarmingTag {
  Simulation = "SIMULATION",
  Driving = "DRIVING",
  Soccer = "SOCCER",
}

export enum EPlatform {
  Mac = "MAC",
  Windows = "WINDOWS",
}

export enum EProfileMarker {
  ProTrader = "PRO TRADER",
}

export enum EActivityType {
  Buy = "buy",
  Bid = "bid",
  Sale = "sale",
}

export enum EBrowseGameBidItemStatus {
  FieldTested = "Field Tested",
}

export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  WalletLink = "walletlink",
}

export enum ESellBuy {
  Sell,
  Buy,
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

export enum EHistoryItemType {
  Created,
  List,
  Sale,
  Transfer,
}
