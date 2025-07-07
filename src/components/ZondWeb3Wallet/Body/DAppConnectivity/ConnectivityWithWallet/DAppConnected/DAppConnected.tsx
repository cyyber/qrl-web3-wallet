import { Card } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import AccountId from "../../../AccountList/AccountId/AccountId";

const DAppConnected = observer(() => {
  const { dAppRequestStore, zondStore } = useStore();
  const { zondAccounts } = zondStore;
  const { isLoading } = zondAccounts;
  const { currentTabData } = dAppRequestStore;

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="text-sm">
        The following accounts are connected, and can interact with this
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
    </Card>
  );
});

export default DAppConnected;
