import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { Unlink } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { Label } from "@/components/UI/Label";
import AccountId from "../../../AccountList/AccountId/AccountId";

const DAppConnected = observer(() => {
  const navigate = useNavigate();
  const { dAppRequestStore, zondStore } = useStore();
  const { zondAccounts } = zondStore;
  const { isLoading } = zondAccounts;
  const { currentTabData, disconnectFromCurrentTab } = dAppRequestStore;

  const disconnect = async () => {
    await disconnectFromCurrentTab();
    navigate(ROUTES.HOME);
  };

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex gap-3">
        <div className="text-sm">
          The following accounts are connected with this website.
        </div>
        <span>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                className="hover:bg-accent hover:text-secondary"
                variant="outline"
                size="icon"
                onClick={disconnect}
              >
                <Unlink size="18" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <Label>Disconnect</Label>
            </TooltipContent>
          </Tooltip>
        </span>
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

export default DAppConnected;
