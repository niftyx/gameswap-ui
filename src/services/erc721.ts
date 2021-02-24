import { TransactionReceipt } from "@ethersproject/abstract-provider/lib/index";
import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import { Interface, id } from "ethers/lib/utils";
import { getLogger } from "utils/logger";
import { ZERO_NUMBER } from "utils/number";
import { ZERO_ADDRESS } from "utils/token";
import { isAddress, isContract } from "utils/tools";
import { IERC721Token, Maybe } from "utils/types";

const logger = getLogger("Services::Erc721");

const erc721Abi = [
  "function getApproved(uint256 tokenId) public  view returns (address)",
  "function approve(address to, uint256 tokenId) public",
  "function setApprovalForAll(address operator, bool _approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function balanceOf(address marketMaker) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function mintItem(address player, string memory tokenURI,string memory gameId, string memory categoryId, string memory contentId) public returns (uint256)",
  "function burnItem(uint256 _itemId) public",
  "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)",
];

const SET_TOKEN_DATA_ID = id(
  "SetTokenData(uint256,string,string,string,string)"
);

class ERC721Service {
  provider: any;
  contract: Contract;

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    tokenAddress: string
  ) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        tokenAddress,
        erc721Abi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, erc721Abi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * @returns A boolean indicating if `operator` is approved to operate all amount of owner
   */
  isApprovedForAll = async (
    owner: string,
    operator: string
  ): Promise<boolean> => {
    logger.log("isApprovedForAll", owner, operator);
    return this.contract.isApprovedForAll(owner, operator);
  };

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  getApproved = async (tokenId: BigNumber): Promise<string> => {
    return this.contract.getApproved(tokenId);
  };

  /**
   * Approve `spender` to transfer `amount` tokens on behalf of the connected user.
   */
  approve = async (
    to: string,
    tokenId: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.approve(to, tokenId);
    logger.log(`Approve transaccion hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveForAll = async (
    operator: string,
    approved: boolean
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.setApprovalForAll(
      operator,
      approved
    );
    logger.log(`ApproveAll hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  getBalanceOf = async (address: string): Promise<any> => {
    return this.contract.balanceOf(address);
  };

  isValidErc721 = async (): Promise<boolean> => {
    try {
      if (!isAddress(this.contract.address)) {
        throw new Error("Is not a valid erc721 address");
      }

      if (!isContract(this.provider, this.contract.address)) {
        throw new Error("Is not a valid contract");
      }

      const [name, symbol] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
      ]);

      return !!(name && symbol);
    } catch (err) {
      logger.error(err.message);
      return false;
    }
  };

  getProfileSummary = async (): Promise<IERC721Token> => {
    let name;
    let symbol;
    try {
      [name, symbol] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
      ]);
    } catch {
      name = "Test";
      symbol = "MKR";
    }

    return {
      address: this.contract.address,
      symbol,
      name,
    };
  };

  mintItem = async (
    player: string,
    tokenURI: string,
    gameId: string,
    categoryId: string,
    contentId: string
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.mintItem(
      player,
      tokenURI,
      gameId,
      categoryId,
      contentId
    );
    logger.log(`mintItem hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  getCreatedAssetId = (txReceipt: TransactionReceipt): BigNumber => {
    const iface = new Interface(erc721Abi);
    const { logs } = txReceipt;
    const log = logs.find((log) => log.topics.includes(SET_TOKEN_DATA_ID));
    if (log) {
      const parsedLog = iface.parseLog(log);
      return parsedLog.args[0];
    }
    return ZERO_NUMBER;
  };

  burnItem = async (tokenId: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.burnItem(tokenId);
    logger.log(`mintItem hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  static encodeTransferFrom = (
    from: string,
    to: string,
    tokenId: BigNumber
  ): string => {
    const transferFromInterface = new utils.Interface(erc721Abi);

    return transferFromInterface.encodeFunctionData("transferFrom", [
      from,
      to,
      tokenId,
    ]);
  };

  static encodeSafeTransferFrom = (
    from: string,
    to: string,
    tokenId: BigNumber
  ): string => {
    const transferFromInterface = new utils.Interface(erc721Abi);

    return transferFromInterface.encodeFunctionData("safeTransferFrom", [
      from,
      to,
      tokenId,
    ]);
  };

  static encodeApprove = (
    spenderAccount: string,
    tokenId: BigNumber
  ): string => {
    const approveInterface = new utils.Interface(erc721Abi);

    return approveInterface.encodeFunctionData("approve", [
      spenderAccount,
      tokenId,
    ]);
  };

  static encodeApproveAll = (operator: string, approved: boolean): string => {
    const approveInterface = new utils.Interface(erc721Abi);

    return approveInterface.encodeFunctionData("setApprovalForAll", [
      operator,
      approved,
    ]);
  };

  static encodeMint = (player: string, tokenURI: string): string => {
    const approveInterface = new utils.Interface(erc721Abi);

    return approveInterface.encodeFunctionData("mintItem", [player, tokenURI]);
  };
}

export { ERC721Service };
