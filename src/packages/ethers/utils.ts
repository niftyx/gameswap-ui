"use strict";

import {
  AbiCoder,
  CoerceFunc,
  EventFragment,
  FormatTypes,
  Fragment,
  FunctionFragment,
  Indexed,
  Interface,
  LogDescription,
  ParamType,
  Result,
  TransactionDescription,
  checkResultErrors,
  defaultAbiCoder,
} from "@ethersproject/abi";
import {
  getAddress,
  getContractAddress,
  getCreate2Address,
  getIcapAddress,
  isAddress,
} from "@ethersproject/address";
import * as base64 from "@ethersproject/base64";
import { Base58 as base58 } from "@ethersproject/basex";
import {
  Bytes,
  BytesLike,
  Hexable,
  arrayify,
  concat,
  hexConcat,
  hexDataLength,
  hexDataSlice,
  hexStripZeros,
  hexValue,
  hexZeroPad,
  hexlify,
  isBytes,
  isBytesLike,
  isHexString,
  joinSignature,
  splitSignature,
  stripZeros,
  zeroPad,
} from "@ethersproject/bytes";
import {
  _TypedDataEncoder,
  hashMessage,
  id,
  isValidName,
  namehash,
} from "@ethersproject/hash";
import {
  HDNode,
  Mnemonic,
  defaultPath,
  entropyToMnemonic,
  isValidMnemonic,
  mnemonicToEntropy,
  mnemonicToSeed,
} from "@ethersproject/hdnode";
import {
  EncryptOptions,
  ProgressCallback,
  getJsonWalletAddress,
} from "@ethersproject/json-wallets";
import { keccak256 } from "@ethersproject/keccak256";
import { Logger } from "@ethersproject/logger";
import {
  Deferrable,
  checkProperties,
  deepCopy,
  defineReadOnly,
  getStatic,
  resolveProperties,
  shallowCopy,
} from "@ethersproject/properties";
import { randomBytes, shuffled } from "@ethersproject/random";
import * as RLP from "@ethersproject/rlp";
import {
  SupportedAlgorithm,
  computeHmac,
  ripemd160,
  sha256,
  sha512,
} from "@ethersproject/sha2";
import {
  SigningKey,
  computePublicKey,
  recoverPublicKey,
} from "@ethersproject/signing-key";
import {
  keccak256 as solidityKeccak256,
  pack as solidityPack,
  sha256 as soliditySha256,
} from "@ethersproject/solidity";
import {
  UnicodeNormalizationForm,
  Utf8ErrorFunc,
  Utf8ErrorFuncs,
  Utf8ErrorReason,
  _toEscapedUtf8String,
  formatBytes32String,
  nameprep,
  parseBytes32String,
  toUtf8Bytes,
  toUtf8CodePoints,
  toUtf8String,
} from "@ethersproject/strings";
import {
  UnsignedTransaction,
  computeAddress,
  parse as parseTransaction,
  recoverAddress,
  serialize as serializeTransaction,
} from "@ethersproject/transactions";
import {
  commify,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "@ethersproject/units";
import { verifyMessage, verifyTypedData } from "@ethersproject/wallet";
import {
  ConnectionInfo,
  FetchJsonResponse,
  OnceBlockable,
  OncePollable,
  PollOptions,
  _fetchData,
  fetchJson,
  poll,
} from "@ethersproject/web";

////////////////////////
// Enums

////////////////////////
// Types and Interfaces

////////////////////////
// Exports
export {
  AbiCoder,
  defaultAbiCoder,
  Fragment,
  EventFragment,
  FunctionFragment,
  ParamType,
  FormatTypes,
  checkResultErrors,
  Logger,
  RLP,
  _fetchData,
  fetchJson,
  poll,
  checkProperties,
  deepCopy,
  defineReadOnly,
  getStatic,
  resolveProperties,
  shallowCopy,
  arrayify,
  concat,
  stripZeros,
  zeroPad,
  isBytes,
  isBytesLike,
  defaultPath,
  HDNode,
  SigningKey,
  Interface,
  LogDescription,
  TransactionDescription,
  base58,
  base64,
  hexlify,
  isHexString,
  hexConcat,
  hexStripZeros,
  hexValue,
  hexZeroPad,
  hexDataLength,
  hexDataSlice,
  nameprep,
  _toEscapedUtf8String,
  toUtf8Bytes,
  toUtf8CodePoints,
  toUtf8String,
  Utf8ErrorFuncs,
  formatBytes32String,
  parseBytes32String,
  hashMessage,
  namehash,
  isValidName,
  id,
  _TypedDataEncoder,
  getAddress,
  getIcapAddress,
  getContractAddress,
  getCreate2Address,
  isAddress,
  formatEther,
  parseEther,
  formatUnits,
  parseUnits,
  commify,
  computeHmac,
  keccak256,
  ripemd160,
  sha256,
  sha512,
  randomBytes,
  shuffled,
  solidityPack,
  solidityKeccak256,
  soliditySha256,
  splitSignature,
  joinSignature,
  parseTransaction,
  serializeTransaction,
  getJsonWalletAddress,
  computeAddress,
  recoverAddress,
  computePublicKey,
  recoverPublicKey,
  verifyMessage,
  verifyTypedData,
  mnemonicToEntropy,
  entropyToMnemonic,
  isValidMnemonic,
  mnemonicToSeed,
  ////////////////////////
  // Enums
  SupportedAlgorithm,
  UnicodeNormalizationForm,
  Utf8ErrorReason,
  Indexed,
};
export type {
  Result,
  Bytes,
  BytesLike,
  Hexable,
  UnsignedTransaction,
  CoerceFunc,
  Mnemonic,
  Deferrable,
  Utf8ErrorFunc,
  ConnectionInfo,
  OnceBlockable,
  OncePollable,
  PollOptions,
  FetchJsonResponse,
  EncryptOptions,
  ProgressCallback,
};
