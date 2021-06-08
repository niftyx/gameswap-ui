import { Web3Provider } from "@ethersproject/providers";

export const signMessage = async (
  data: string,
  provider: Web3Provider
): Promise<string> => {
  return provider.getSigner().signMessage(data);
};
