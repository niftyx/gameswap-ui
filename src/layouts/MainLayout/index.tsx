import React from "react";

import { Header } from "./components";

interface IProps {
  children: React.ReactNode;
}

const MainLayout = (props: IProps) => {
  return (
    <div>
      <Header />
      <main>{props.children}</main>
    </div>
  );
};

export default MainLayout;
