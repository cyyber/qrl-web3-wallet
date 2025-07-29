import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { lazy } from "react";

const ZondWeb3WalletLogo = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/Wallet/Header/ZondWeb3WalletLogo/ZondWeb3WalletLogo"
      ),
  ),
);
const AccountBadge = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/Wallet/Header/AccountBadge/AccountBadge"
      ),
  ),
);
const DAppBadge = withSuspense(
  lazy(
    () =>
      import("@/components/ZondWeb3Wallet/Wallet/Header/DAppBadge/DAppBadge"),
  ),
);
const ChainBadge = withSuspense(
  lazy(
    () =>
      import("@/components/ZondWeb3Wallet/Wallet/Header/ChainBadge/ChainBadge"),
  ),
);

const Header = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { isConnected } = zondConnection;

  return (
    <div className="fixed top-0 z-20 flex h-16 w-full items-center justify-between border-b-2 border-secondary bg-background px-4">
      <ZondWeb3WalletLogo />
      <div className="flex gap-2">
        {isConnected && (
          <>
            <AccountBadge />
            <DAppBadge />
          </>
        )}
        <ChainBadge displayChainName={false} />
      </div>
    </div>
  );
});

export default Header;
