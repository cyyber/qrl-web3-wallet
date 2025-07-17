import { useStore } from "@/stores/store";
import { Loader, Network, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const ChainBadgeIcon = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected, blockchain } = zondConnection;
  const { chainName, defaultIconUrl } = blockchain;

  const [hasUrlError, setHasUrlError] = useState(false);

  useEffect(() => {
    setHasUrlError(false);
  }, [defaultIconUrl]);

  if (isLoading)
    return (
      <Loader className="h-3 w-3 animate-spin" data-testid="loader-icon" />
    );
  if (!isConnected)
    return <WifiOff className="h-3 w-3" data-testid="wifi-off-icon" />;
  if (hasUrlError)
    return <Network className="h-3 w-3" data-testid="network-icon" />;

  return (
    <img
      className="h-3 w-3"
      src={defaultIconUrl}
      alt={chainName}
      onError={() => setHasUrlError(true)}
    />
  );
});

export default ChainBadgeIcon;
