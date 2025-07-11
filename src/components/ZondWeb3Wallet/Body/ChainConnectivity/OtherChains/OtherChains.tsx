import { Label } from "@/components/UI/Label";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import OtherChainItem from "./OtherChainItem/OtherChainItem";

const OtherChains = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { blockchain } = zondConnection;
  const { chainId } = blockchain;

  const [otherChains, setOtherChains] = useState<BlockchainDataType[]>([]);

  useEffect(() => {
    (async () => {
      const blockchains = await StorageUtil.getAllBlockChains();
      setOtherChains(blockchains.filter((chain) => chain.chainId !== chainId));
    })();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Other chains</Label>
      {otherChains.map((blockchain) => {
        return <OtherChainItem blockchain={blockchain} />;
      })}
    </div>
  );
});

export default OtherChains;
