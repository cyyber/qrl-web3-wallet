import withSuspense from "@/functions/withSuspense";
import { lazy } from "react";

const Header = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/Wallet/Header/Header")),
);
const Body = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/Wallet/Body/Body")),
);

const Wallet = () => {
  return (
    <>
      <Header />
      <Body />
    </>
  );
};

export default Wallet;
