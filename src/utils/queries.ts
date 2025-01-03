import gql from "graphql-tag";

const userFragment = gql`
  fragment userFragment on users {
    id
    address
    name
    custom_url
    image_url
    header_image_url
    bio
    twitter_username
    twitter_verified
    twitch_username
    facebook_username
    youtube_username
    instagram_username
    tiktok_username
    personal_site
    create_time_stamp
    update_time_stamp
  }
`;

const collectionFragment = gql`
  fragment collectionFragment on collections {
    id
    address
    name
    symbol
    image_url
    total_supply
    total_minted
    total_burned
    block
    is_private
    is_verified
    is_premium
    is_featured
    owner_id
    game_id
    description
    create_time_stamp
    update_time_stamp
  }
`;

const collectionFields = `
  id
  address
  name
  symbol
  image_url
  total_supply
  total_minted
  total_burned
  block
  is_private
  is_verified
  is_premium
  is_featured
  owner_id
  game_id
  description
  create_time_stamp
  update_time_stamp
`;

const assetHistoryFragment = gql`
  fragment assetHistoryFragment on asset_histories {
    id
    tx_hash
    asset_id
    owner_id
    erc20
    erc20_amount
    timestamp
  }
`;

const assetHistoryFields = `
  id
  tx_hash
  asset_id
  owner_id
  erc20
  erc20_amount
  timestamp
`;

const collectionHistoryFragment = gql`
  fragment collectionHistoryFragment on collection_histories {
    id
    tx_hash
    collection_id
    owner_id
    timestamp
  }
`;

const assetFragment = gql`
  fragment assetFragment on assets {
    id
    asset_id
    asset_url
    collection_id
    content_id
    create_time_stamp
    update_time_stamp
    owner_id
    creator_id
  }
`;

const assetFields = `
    id
    asset_id
    asset_url
    collection_id
    content_id
    create_time_stamp
    update_time_stamp
    owner_id
    creator_id
`;

const gameFragment = gql`
  fragment gameFragment on games {
    id
    name
    version
    image_url
    custom_url
    header_image_url
    category_id
    description
    platform
    is_verified
    is_premium
    is_featured
    create_time_stamp
    update_time_stamp
    owner_id
  }
`;

const gameFields = `
    id
    name
    version
    image_url
    custom_url
    header_image_url
    category_id
    description
    platform
    is_verified
    is_premium
    is_featured
    create_time_stamp
    update_time_stamp
    owner_id
`;

export const connectQuery = `
  query($message: String!, $signedMessage: String!) {
    signIn(message: $message, signedMessage: $signedMessage) {
      jwt_token
      jwt_expires_in
      refresh_token
    }
  }
`;

// games

export const createGameMutation = `
  mutation ($payload: GameInput!) {
      createGame(payload: $payload) {
          ${gameFields}
      }
  }
`;

export const updateGameMutation = `
  mutation ($id: String!, $payload: GameInput!) {
      updateGame(id: $id, payload: $payload) {
          ${gameFields}
      }
  }
`;

export const queryGameById = gql`
  query($id: String!) {
    games(where: { id: { _eq: $id } }) {
      ...gameFragment
    }
  }
  ${gameFragment}
`;

export const queryFeaturedGames = `
  query($offset: Int!, $limit: Int!) {
    games(where: { is_featured: { _eq: true } }, offset: $offset, limit: $limit) {
      ${gameFields}
    }
  }
`;

// collections
export const queryFeaturedAndPublicCollections = `
  query($offset: Int!, $limit: Int!) {
    collections(where: {_or: [{is_private: {_eq: false}},{is_featured: {_eq: true}} ]}, offset: $offset, limit: $limit) {
      ${collectionFields}
    }
  }
`;

export const queryCollectionsByGameId = gql`
  query($id: String!, $offset: Int!, $limit: Int!) {
    collections(
      where: { game_id: { _eq: $id } }
      offset: $offset
      limit: $limit
    ) {
      ...collectionFragment
    }
  }
  ${collectionFragment}
`;

export const queryCollectionById = gql`
  query($id: String!) {
    collections(where: { id: { _eq: $id } }) {
      ...collectionFragment
    }
  }
  ${collectionFragment}
`;

// assets
export const queryAssetsByCollectionId = `
  query($id: String!, $offset: Int!, $limit: Int!) {
    assets(where: {collection_id: {_eq: $id}}, order_by: {update_time_stamp: desc}, limit: $limit, offset: $offset) {
      ${assetFields}
    }
  }
`;

export const queryAssetsByCreatorId = `
  query($id: String!, $offset: Int!, $limit: Int!) {
    assets(where: {creator_id: {_eq: $id}}, order_by: {update_time_stamp: desc}, limit: $limit, offset: $offset) {
      ${assetFields}
    }
  }
`;

export const buildQueryInventoryAssets = (params: {
  gameId?: string;
  ownerId: string;
  collectionId?: string;
}) => {
  return `
  query($ownerId: String!, ${
    params.collectionId ? "$collectionId: String!," : ""
  } ${params.gameId ? "$gameId: String!" : ""} $offset: Int!, $limit: Int!) {
    assets(where: {owner_id: {_eq: $ownerId}${
      params.collectionId ? `, collection_id: {_eq: $collectionId}` : ""
    }} ${
    params.gameId ? ", collection: {game_id: {_eq: $gameId}}" : ""
  }, order_by: {update_time_stamp: desc}, limit: $limit, offset: $offset) {
      ${assetFields}
    }
  }
`;
};

export const queryAssetById = gql`
  query($id: String!) {
    assets(where: { id: { _eq: $id } }) {
      ...assetFragment
    }
  }
  ${assetFragment}
`;

export const queryAssetsByGameId = `
  query($id: String!, $offset: Int!, $limit: Int!) {
    assets(
      where: { collection: { game_id: { _eq: $id } } }
      offset: $offset
      limit: $limit
    ) {
      ${assetFields}
    }
  }
`;

export const queryAssetsByAssetIdAndCollectionId = gql`
  query($assetId: String!, $collectionId: String!) {
    assets(
      where: {
        asset_id: { _eq: $assetId }
        collection_id: { _eq: $collectionId }
      }
    ) {
      ...assetFragment
    }
  }
  ${assetFragment}
`;

// users
export const queryUserById = gql`
  query($id: String!) {
    users(where: { id: { _eq: $id } }) {
      ...userFragment
    }
  }
  ${userFragment}
`;

// assetHistory
export const queryAssetHistoryByAssetId = `
  query($id: String!, $offset: Int!, $limit: Int!) {
    asset_histories(
      where: {asset: {id: {_eq: $id}}}
      order_by: {timestamp: desc}
      offset: $offset
      limit: $limit
    ) {
      ${assetHistoryFields}
    }
  }
`;
