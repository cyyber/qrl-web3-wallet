import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { lazy, useEffect, useState } from "react";
import CircuitBackground from "../Wallet/Body/Shared/CircuitBackground/CircuitBackground";

const SCREENS = {
  LOADING: "LOADING",
  DAPP_REQUEST: "DAPP_REQUEST",
  WALLET: "WALLET",
};

const DAppRequest = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/DAppRequest/DAppRequest")),
);
const Wallet = withSuspense(
  lazy(() => import("@/components/ZondWeb3Wallet/Wallet/Wallet")),
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

  if (screen === SCREENS.LOADING)
    return (
      <>
        <CircuitBackground />
        <div className="flex justify-center pt-48">
          <Loader className="animate-spin" size={86} />
        </div>
      </>
    );

  if (screen === SCREENS.DAPP_REQUEST) return <DAppRequest />;

  if (screen === SCREENS.WALLET) return <Wallet />;
});

export default ScreenLoader;
