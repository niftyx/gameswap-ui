import { TransactionReceipt } from "@ethersproject/abstract-provider/lib/index";
import { Contract, Wallet, ethers, utils } from "packages/ethers";
import { getLogger } from "utils/logger";
import { Maybe } from "utils/types";

const { Interface } = utils;
const logger = getLogger("Services::Erc20");

const factoryAbi = [
  "function createGswap721(string memory name,string memory symbol,string memory url,bool isPrivate) public returns (address)",
  "event CollectionCreated(address indexed tokenAddress,string name,string symbol,string url,bool isPrivate)",
];

class ERC721FactoryService {
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
        factoryAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, factoryAbi, provider);
    }
  }

  get collectionsCount(): string {
    return this.contract.collectionsCount;
  }

  collectionAt = async (index: number): Promise<string> => {
    return this.contract.allCollections(index);
  };

  createGswap721 = async (
    name: string,
    symbol: string,
    url: string,
    isPrivate: boolean
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.createGswap721(
      name,
      symbol,
      url,
      isPrivate
    );
    logger.log(`CreateGswap721 transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  getCreatedCollectionId = (txReceipt: TransactionReceipt): string => {
    const iface = new Interface(factoryAbi);
    const { logs } = txReceipt;
    const filter = this.contract.filters.CollectionCreated();
    if (!filter.topics || filter.topics.length === 0) return "";
    const CollectionCreatedId = filter.topics[0] as string;
    const log = logs.find((log) => log.topics.includes(CollectionCreatedId));
    if (log) {
      const parsedLog = iface.parseLog(log);
      return parsedLog.args[0];
    }
    return "";
  };
}

export { ERC721FactoryService };
