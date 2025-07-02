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
import { Unlink } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

const requestStatusClasses = cva("h-2 w-2 rounded-full", {
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

const DAppBadge = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected, currentTabData } = dAppRequestStore;

  return (
    <Link to={ROUTES.DAPP_CONNECTIVITY}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 rounded-full text-xs text-foreground"
          >
            <Card
              className={requestStatusClasses({
                hasDAppConnected,
              })}
            />
            {hasDAppConnected && currentTabData?.favIconUrl ? (
              <img
                className="h-3 w-3"
                src={currentTabData?.favIconUrl}
                alt={currentTabData?.title}
              />
            ) : (
              <Unlink className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <Label>DApp Connectivity</Label>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
});

export default DAppBadge;
