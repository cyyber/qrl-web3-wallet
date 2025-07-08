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
import { Wifi, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Link, useLocation } from "react-router-dom";

const badgeButtonClasses = cva(
  "flex items-center gap-1 rounded-full text-xs text-foreground",
  {
    variants: {
      isActive: {
        true: ["bg-accent"],
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

const connectivityStatusClasses = cva("h-2 w-2 rounded-full", {
  variants: {
    hasChainConnected: {
      true: ["bg-constructive"],
      false: ["bg-destructive"],
    },
    isLoading: {
      true: ["bg-secondary animate-ping"],
    },
  },
  defaultVariants: {
    hasChainConnected: false,
    isLoading: true,
  },
});

type ChainBadgeProps = {
  isDisabled?: boolean;
  displayChainName?: boolean;
};

const ChainBadge = observer(
  ({ isDisabled = false, displayChainName = true }: ChainBadgeProps) => {
    const location = useLocation();
    const pathName = location.pathname;
    const { zondStore } = useStore();
    const { zondConnection } = zondStore;
    const { isLoading, isConnected, blockchain } = zondConnection;

    return (
      <Link to={ROUTES.CHAIN_CONNECTIVITY}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isDisabled || isLoading}
              className={badgeButtonClasses({
                isActive: pathName === ROUTES.CHAIN_CONNECTIVITY,
              })}
            >
              <Card
                className={connectivityStatusClasses({
                  hasChainConnected: isConnected,
                  isLoading,
                })}
              />
              {isConnected ? (
                // <img
                //   className="h-3 w-3"
                //   src={currentTabData?.favIconUrl}
                //   alt={currentTabData?.title}
                // />
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {displayChainName && blockchain.chainName}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <Label>Blockchain Selection</Label>
          </TooltipContent>
        </Tooltip>
      </Link>
    );
  },
);

export default ChainBadge;
