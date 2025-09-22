import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { lazy } from "react";
import ConnectionFailed from "./ConnectionFailed/ConnectionFailed";

const AccountCreateImport = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/AccountCreateImport"
      ),
  ),
);
const BackgroundVideo = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/BackgroundVideo/BackgroundVideo"
      ),
  ),
);

const Home = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected } = zondConnection;

  return (
    <>
      <BackgroundVideo />
      <div className="relative z-10 flex w-full flex-col items-center p-8">
        {isLoading ? (
          <Loader className="animate-spin text-foreground" size="86" />
        ) : (
          <div className="flex animate-appear-in flex-col items-center gap-8">
            {isConnected ? <AccountCreateImport /> : <ConnectionFailed />}
          </div>
        )}
      </div>
    </>
  );
});

export default Home;
