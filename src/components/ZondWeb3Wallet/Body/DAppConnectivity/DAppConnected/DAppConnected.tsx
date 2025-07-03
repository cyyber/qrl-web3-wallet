import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Unlink } from "lucide-react";
import { observer } from "mobx-react-lite";
import AccountId from "../../AccountList/AccountId/AccountId";

const DAppConnected = observer(() => {
  const { dAppRequestStore, zondStore } = useStore();
  const { zondAccounts } = zondStore;
  const { isLoading } = zondAccounts;
  const { currentTabData } = dAppRequestStore;

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="text-sm">
        The following accounts are connected to, and can interact with this
        website.
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
      <div className="grid grid-cols-2 gap-4">
        <span />
        <Button
          className="w-full"
          type="button"
          variant="outline"
          onClick={() => {}}
        >
          <Unlink className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </div>
    </Card>
  );
});

export default DAppConnected;
