import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { Loader, Network, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const ChainBadgeIcon = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected, blockchain } = zondConnection;
  const { chainId } = blockchain;

  const [hasUrlError, setHasUrlError] = useState(false);
  const [activeChain, setActiveChain] = useState<
    BlockchainDataType | undefined
  >();

  useEffect(() => {
    (async () => {
      const blockchains = await StorageUtil.getAllBlockChains();
      setActiveChain(blockchains.find((chain) => chain.chainId === chainId));
    })();
  }, [chainId]);

  if (isLoading) return <Loader className="h-3 w-3 animate-spin" />;
  if (!isConnected) return <WifiOff className="h-3 w-3" />;
  if (hasUrlError) return <Network className="h-3 w-3" />;

  return (
    <img
      className="h-3 w-3"
      src={activeChain?.defaultIconUrl}
      alt={activeChain?.chainName}
      onError={() => setHasUrlError(true)}
    />
  );
});

export default ChainBadgeIcon;
