/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IGlobalData } from "utils/types.d";

const defaultData: IGlobalData = {
  itemCartIds: [],
  inventoryCartIds: [],
};

const GlobalContext = createContext({
  data: defaultData,
  updateData: () => {},
  toggleItemCart: (_: string) => {},
  toggleInventoryCart: (_: string) => {},
  isInItemCart: (_: string) => {},
  isInInventoryCart: (_: string) => {},
});

/**
 * This hook can only be used by components under the `GlobalProvider` component. Otherwise it will throw.
 */
export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: IProps) => {
  const [currentData, setCurrentData] = useState(defaultData);

  const handleUpdateData = (update = {}) => {
    const mergedData = _.merge({}, currentData, update);
    setCurrentData(mergedData);
  };

  const toggleItemCart = (cartId: string) => {
    if (currentData.itemCartIds.includes(cartId)) {
      setCurrentData((prevData) => ({
        ...prevData,
        itemCartIds: prevData.itemCartIds.filter(
          (element) => element !== cartId
        ),
      }));
    } else {
      setCurrentData((prevData) => ({
        ...prevData,
        itemCartIds: [...prevData.itemCartIds, cartId],
      }));
    }
  };

  const toggleInventoryCart = (cartId: string) => {
    if (currentData.inventoryCartIds.includes(cartId)) {
      setCurrentData((prevData) => ({
        ...prevData,
        inventoryCartIds: prevData.inventoryCartIds.filter(
          (element) => element !== cartId
        ),
      }));
    } else {
      setCurrentData((prevData) => ({
        ...prevData,
        inventoryCartIds: [...prevData.inventoryCartIds, cartId],
      }));
    }
  };

  const isInItemCart = (cartId: string): boolean => {
    return currentData.itemCartIds.includes(cartId);
  };

  const isInInventoryCart = (cartId: string): boolean => {
    return currentData.inventoryCartIds.includes(cartId);
  };

  return (
    <GlobalContext.Provider
      value={{
        data: currentData,
        updateData: handleUpdateData,
        toggleInventoryCart,
        toggleItemCart,
        isInInventoryCart,
        isInItemCart,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalConsumer = GlobalContext.Consumer;

export default GlobalContext;
