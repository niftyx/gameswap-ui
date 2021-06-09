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
