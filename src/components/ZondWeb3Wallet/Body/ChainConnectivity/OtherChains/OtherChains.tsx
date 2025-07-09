import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/DropdownMenu";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { EllipsisVertical, Pencil, Trash, Wifi } from "lucide-react";
import ChainIcon from "../ChainIcon/ChainIcon";
import StorageUtil from "@/utilities/storageUtil";
import { useEffect, useState } from "react";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/store";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/router";

const OtherChains = observer(() => {
  const navigate = useNavigate();
  const { zondStore } = useStore();
  const { zondConnection, selectBlockchain } = zondStore;
  const { blockchain } = zondConnection;
  const { chainId } = blockchain;

  const [otherChains, setOtherChains] = useState<BlockchainDataType[]>([]);

  useEffect(() => {
    (async () => {
      const blockchains = await StorageUtil.getAllBlockChains();
      setOtherChains(blockchains.filter((chain) => chain.chainId !== chainId));
    })();
  }, []);

  const connectChain = (chainId: string) => {
    navigate(ROUTES.HOME);
    selectBlockchain(chainId);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Other chains</Label>
      {otherChains.map((blockchain) => {
        const { defaultRpcUrl, chainName, chainId, defaultIconUrl } =
          blockchain;
        return (
          <Card className="flex justify-between gap-4 p-4">
            <div className="flex gap-4">
              <ChainIcon src={defaultIconUrl} alt={chainName} />
              <div className="flex flex-col break-all">
                <span className="font-bold">{chainName}</span>
                <span className="text-xm opacity-80">{defaultRpcUrl}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7 hover:bg-accent hover:text-secondary"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      connectChain(chainId);
                    }}
                  >
                    <Wifi size="16" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <Label>Connect chain</Label>
                </TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="size-7 hover:bg-accent hover:text-secondary"
                    variant="outline"
                    size="icon"
                  >
                    <EllipsisVertical size="16" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer data-[highlighted]:text-secondary"
                      onClick={() => {}}
                    >
                      <div className="flex gap-2">
                        <Pencil size="16" />
                        <span>Edit chain</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer data-[highlighted]:text-secondary"
                      onClick={() => {}}
                    >
                      <div className="flex gap-2">
                        <Trash size="16" />
                        <span>Delete chain</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        );
      })}
    </div>
  );
});

export default OtherChains;
