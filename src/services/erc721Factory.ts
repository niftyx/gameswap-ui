import { TransactionReceipt } from "@ethersproject/abstract-provider/lib/index";
import { Contract, Wallet, ethers } from "packages/ethers";
import { getLogger } from "utils/logger";
import { Maybe } from "utils/types";

const logger = getLogger("Services::Erc20");

const erc20Abi = [
  "function createGswap721(string memory name,string memory symbol,string memory imageUrl,string memory description,bool isPrivate) public returns (address)",
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
        erc20Abi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
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
    imageURL: string,
    description: string,
    isPrivate: boolean
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.createGswap721(
      name,
      symbol,
      imageURL,
      description,
      isPrivate
    );
    logger.log(`CreateGswap721 transaccion hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };
}

export { ERC721FactoryService };
