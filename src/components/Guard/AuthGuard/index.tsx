import { LoadingScreen } from "components";
import { useConnectedWeb3Context } from "contexts";
import React from "react";
import { Redirect } from "react-router-dom";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const AuthGuard = (props: IProps) => {
  const { account, initialized } = useConnectedWeb3Context();
  if (!initialized) {
    return <LoadingScreen />;
  }
  if (!account) {
    return <Redirect to="/" />;
  }
  return <>{props.children}</>;
};
