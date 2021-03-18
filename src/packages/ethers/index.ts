import * as ethers from "./ethers";

try {
  const anyGlobal = window as any;

  if (anyGlobal._ethers == null) {
    anyGlobal._ethers = ethers;
  }
} catch (error) {
  console.error(error);
}

export { ethers };

export {
  Signer,
  Wallet,
  VoidSigner,
  getDefaultProvider,
  providers,
  Contract,
  ContractFactory,
  BigNumber,
  FixedNumber,
  constants,
  errors,
  logger,
  utils,
  wordlists,
  ////////////////////////
  // Compile-Time Constants
  version,
  Wordlist,
} from "./ethers";
export type {
  ////////////////////////
  // Types
  ContractFunction,
  ContractReceipt,
  ContractTransaction,
  Event,
  EventFilter,
  Overrides,
  PayableOverrides,
  CallOverrides,
  PopulatedTransaction,
  ContractInterface,
  BigNumberish,
  Bytes,
  BytesLike,
  Signature,
  Transaction,
  UnsignedTransaction,
} from "./ethers";
