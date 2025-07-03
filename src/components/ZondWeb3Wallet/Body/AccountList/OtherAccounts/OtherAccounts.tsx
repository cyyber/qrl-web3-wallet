import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import { Separator } from "@/components/UI/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { ArrowRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import AccountId from "../AccountId/AccountId";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/router";

const OtherAccounts = observer(() => {
  const navigate = useNavigate();
  const { zondStore } = useStore();
  const { zondAccounts, activeAccount, setActiveAccount, zondConnection } =
    zondStore;
  const { accountAddress: activeAccountAddress } = activeAccount;
  const { accounts } = zondAccounts;
  const { blockchain } = zondConnection;

  const otherAccountsLabel = `${activeAccountAddress ? "Other accounts" : "Accounts"} in the wallet`;
  const otherAccounts = accounts.filter(
    ({ accountAddress }) => accountAddress !== activeAccountAddress,
  );

  const onAccountSwitch = async (accountAddress: string) => {
    await StorageUtil.clearTransactionValues(blockchain);
    navigate(ROUTES.HOME);
    await setActiveAccount(accountAddress);
  };

  return (
    !!otherAccounts.length && (
      <>
        <Separator className="mt-3" />
        <Label className="text-lg font-bold">{otherAccountsLabel}</Label>
        {otherAccounts.map(({ accountAddress }) => (
          <Card
            key={accountAddress}
            id={accountAddress}
            className="flex gap-3 p-3 font-bold text-foreground hover:bg-accent"
          >
            <AccountId account={accountAddress} />
            <span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="hover:text-secondary"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      onAccountSwitch(accountAddress);
                    }}
                  >
                    <ArrowRight size="18" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <Label>Switch to this account</Label>
                </TooltipContent>
              </Tooltip>
            </span>
          </Card>
        ))}
      </>
    )
  );
});

export default OtherAccounts;
