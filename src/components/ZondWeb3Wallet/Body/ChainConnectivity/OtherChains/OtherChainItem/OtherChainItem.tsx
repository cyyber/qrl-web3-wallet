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
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { ROUTES } from "@/router/router";
import { EllipsisVertical, Pencil, Trash, Wifi } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import ChainIcon from "../../ChainIcon/ChainIcon";
import { useStore } from "@/stores/store";

type OtherChainItemProps = {
  blockchain: BlockchainDataType;
};

const OtherChainItem = observer(({ blockchain }: OtherChainItemProps) => {
  const navigate = useNavigate();
  const { zondStore } = useStore();
  const { selectBlockchain } = zondStore;
  const { defaultRpcUrl, chainName, chainId, defaultIconUrl, isCustomChain } =
    blockchain;

  const connectChain = (chainId: string) => {
    navigate(ROUTES.HOME);
    selectBlockchain(chainId);
  };

  return (
    <Card className="flex justify-between gap-4 p-4">
      <div className="flex gap-4">
        <div className="pt-1">
          <ChainIcon src={defaultIconUrl} alt={chainName} />
        </div>
        <div className="flex flex-col break-all">
          <span className="font-bold">{chainName}</span>
          <span className="text-xm opacity-80">{chainId}</span>
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
              <Link to={ROUTES.ADD_CHAIN} state={{ hasState: true, chainId }}>
                <DropdownMenuItem className="cursor-pointer data-[highlighted]:text-secondary">
                  <div className="flex gap-2">
                    <Pencil size="16" />
                    <span>Edit chain</span>
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                disabled={!isCustomChain}
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
});

export default OtherChainItem;
