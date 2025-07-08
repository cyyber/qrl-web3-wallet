import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { Earth, Unlink } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const connectivityStatusClasses = cva("h-3 w-3 rounded-full", {
  variants: {
    hasDAppConnected: {
      true: ["bg-constructive"],
      false: ["bg-destructive"],
    },
  },
  defaultVariants: {
    hasDAppConnected: false,
  },
});

const ActiveBrowserTab = observer(() => {
  const navigate = useNavigate();
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected, currentTabData, disconnectFromCurrentTab } =
    dAppRequestStore;

  const disconnect = async () => {
    await disconnectFromCurrentTab();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Active browser tab</Label>
      <Card className="flex justify-between gap-4 p-4">
        <div className="flex gap-4">
          <div className="flex h-min items-center gap-2">
            <Card
              className={connectivityStatusClasses({
                hasDAppConnected,
              })}
            />
            {currentTabData?.favIconUrl ? (
              <div className="h-6 w-6">
                <img
                  src={currentTabData?.favIconUrl}
                  alt={currentTabData?.title}
                />
              </div>
            ) : (
              <Earth className="h-6 w-6" />
            )}
          </div>
          <div className="flex flex-col break-all">
            <span className="font-bold">{currentTabData?.urlOrigin}</span>
            <span className="text-xm opacity-80">{currentTabData?.title}</span>
          </div>
        </div>
        {hasDAppConnected && (
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  className="size-7 hover:bg-accent hover:text-secondary"
                  variant="outline"
                  size="icon"
                  onClick={disconnect}
                >
                  <Unlink size="16" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <Label>Disconnect</Label>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </Card>
    </div>
  );
});

export default ActiveBrowserTab;
