/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPFS_CONFIG } from "config/constants";
import IPFS from "ipfs-mini";
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";

const IpfsContext = createContext({
  ipfs: null,
});

const ipfsInstance = new (IPFS as any)(IPFS_CONFIG);

/**
 * This hook can only be used by components under the `GlobalProvider` component. Otherwise it will throw.
 */
export const useIpfs = () => {
  const context = useContext(IpfsContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const IpfsProvider = ({ children }: IProps) => {
  return (
    <IpfsContext.Provider
      value={{
        ipfs: ipfsInstance,
      }}
    >
      {children}
    </IpfsContext.Provider>
  );
};

export const IpfsConsumer = IpfsContext.Consumer;

export default IpfsContext;
