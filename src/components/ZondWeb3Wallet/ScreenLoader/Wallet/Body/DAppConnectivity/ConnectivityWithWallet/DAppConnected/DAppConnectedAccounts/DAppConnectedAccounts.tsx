import { Card } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import AccountId from "../../../../AccountList/AccountId/AccountId";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { Button } from "@/components/UI/Button";
import { Label } from "@/components/UI/Label";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router/router";

const DAppConnectedAccounts = observer(() => {
  const { dAppRequestStore, zondStore } = useStore();
  const { zondAccounts } = zondStore;
  const { isLoading } = zondAccounts;
  const { currentTabData } = dAppRequestStore;

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <div className="text-sm">
          The following accounts are connected, and can interact with this
          website.
        </div>
        <div className="shrink-0">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={ROUTES.EDIT_DAPP_CONNECTED_ACCOUNTS}
                state={{ hasState: true }}
                aria-label="Edit chain"
              >
                <Button
                  className="size-7 hover:bg-accent hover:text-secondary"
                  variant="outline"
                  size="icon"
                  aria-label="Edit"
                >
                  <Pencil size="16" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
              <Label>Edit connected accounts</Label>
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
          {currentTabData?.connectedAccounts?.map((accountAddress) => (
            <Card
              key={accountAddress}
              id={accountAddress}
              className="p-3 font-bold text-foreground"
            >
              <AccountId account={accountAddress} />
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
});

export default DAppConnectedAccounts;
