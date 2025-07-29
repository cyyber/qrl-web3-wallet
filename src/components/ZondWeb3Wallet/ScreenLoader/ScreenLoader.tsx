import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { lazy, useEffect, useState } from "react";

const SCREENS = {
  LOADING: "LOADING",
  DAPP_REQUEST: "DAPP_REQUEST",
  WALLET: "WALLET",
};

const ScreenLoading = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/ScreenLoading/ScreenLoading"
      ),
  ),
);
const DAppRequest = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequest"
      ),
  ),
);
const Wallet = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Wallet")),
);

const ScreenLoader = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppRequest, readDAppRequestData } = dAppRequestStore;

  const [screen, setScreen] = useState(SCREENS.LOADING);

  useEffect(() => {
    readDAppRequestData();
  }, []);

  useEffect(() => {
    if (hasDAppRequest) {
      setScreen(SCREENS.DAPP_REQUEST);
    } else {
      setScreen(SCREENS.WALLET);
    }
  }, [hasDAppRequest]);

  if (screen === SCREENS.LOADING) return <ScreenLoading />;

  if (screen === SCREENS.DAPP_REQUEST) return <DAppRequest />;

  if (screen === SCREENS.WALLET) return <Wallet />;
});

export default ScreenLoader;
