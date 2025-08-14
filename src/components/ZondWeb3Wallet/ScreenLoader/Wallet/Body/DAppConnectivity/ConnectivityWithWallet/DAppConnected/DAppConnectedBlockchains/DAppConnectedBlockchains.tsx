import { Card } from "@/components/UI/Card";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ChainIcon from "../../../../ChainConnectivity/ChainIcon/ChainIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { Button } from "@/components/UI/Button";
import { Pencil } from "lucide-react";
import { Label } from "@/components/UI/Label";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router/router";

const DAppConnectedBlockchains = observer(() => {
  const { dAppRequestStore } = useStore();
  const { currentTabData } = dAppRequestStore;

  const [isLoading, setIsLoading] = useState(true);
  const [blockchains, setBlockchains] = useState<BlockchainDataType[]>([]);

  useEffect(() => {
    (async () => {
      const allBlockchains = (await StorageUtil.getAllBlockChains()).filter(
        (blockchain) =>
          currentTabData?.connectedBlockchains?.includes(blockchain.chainId),
      );
      setBlockchains(allBlockchains);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <div className="text-sm">
          The following blockchains are allowed to be used by this website
        </div>
        <div className="shrink-0">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={ROUTES.EDIT_DAPP_CONNECTED_BLOCKCHAINS}
                state={{ hasState: true }}
                aria-label="Edit chain"
              >
                <Button
                  className="size-7 hover:bg-accent hover:text-secondary"
                  variant="outline"
                  size="icon"
                  aria-label="Edit"
                  onClick={() => {}}
                >
                  <Pencil size="16" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
              <Label>Edit connected blockchains</Label>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-20 w-full animate-pulse items-center justify-between">
          <div className="h-full w-full rounded-md bg-accent" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {blockchains?.map(
            ({ chainId, chainName, defaultIconUrl, defaultRpcUrl }) => (
              <Card className="flex justify-between gap-3 p-3">
                <div className="flex gap-3">
                  <div className="pt-1">
                    <ChainIcon src={defaultIconUrl} alt={chainName} />
                  </div>
                  <div className="flex flex-col break-all">
                    <span className="font-bold">{chainName}</span>
                    <span className="text-xm opacity-80">
                      Chain ID {parseInt(chainId, 16)}
                    </span>
                    <span className="text-xm opacity-80">{defaultRpcUrl}</span>
                  </div>
                </div>
              </Card>
            ),
          )}
        </div>
      )}
    </Card>
  );
});

export default DAppConnectedBlockchains;
