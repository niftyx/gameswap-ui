### [Deprecation Notice] - This repo is deprecated and a new v2 platform has been written from scratch which supersedes Gameswap v1. There's no release date at the moment and the project is on standby.

# gameswap-ui description

Gameswap dApp UI in React JS.

# Configuration

- Open "node_modules/@0x/order-utils/lib/src/constants.js", and update the followings:

  1. "0x Protocol" => "Niftyx Protocol"
  2. "0x Protocol Coordinate" => "Niftyx Protocol Coordinate"

- Env
  1. REACT_APP_SERVICE_FEE: // 0.025 means 2.5%
  2. REACT_APP_RELAYER_URL_AVAXTEST
  3. REACT_APP_RELAYER_WS_URL_AVAXTEST
  4. REACT_APP_RELAYER_URL_AVAXMAIN
  5. REACT_APP_RELAYER_WS_URL_AVAXMAIN
  6. REACT_APP_RELAYER_RPS: RATE LIMIT to RELAYER API (Niftyx-api)
  7. REACT_APP_API: API url of Gameswap-backend
  8. REACT_APP_ERC721_FACTORY_TEST: Address of Gameswap NFT Contract on Testnet
  9. REACT_APP_ERC721_FACTORY_MAIN: Address of Gameswap NFT Contract on Mainnet
  10. REACT_APP_TEST: 1 means TestMode, 0 means MainNet

# How to run

1. yarn install
2. create .env
3. yarn build
