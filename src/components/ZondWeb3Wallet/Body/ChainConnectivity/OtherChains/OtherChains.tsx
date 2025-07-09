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
import { EllipsisVertical, Pencil, Trash, Wifi, WifiOff } from "lucide-react";

const OtherChains = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Other chains</Label>
      <Card className="flex justify-between gap-4 p-4">
        <div className="flex gap-4">
          <div className="flex gap-2">
            <WifiOff className="h-6 w-6" />
          </div>
          <div className="flex flex-col break-all">
            <span className="font-bold">chain 1</span>
            <span className="text-xm opacity-80">chain1.chain.com:8081</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                className="size-7 hover:bg-accent hover:text-secondary"
                variant="outline"
                size="icon"
                onClick={() => {}}
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
    </div>
  );
};

export default OtherChains;
