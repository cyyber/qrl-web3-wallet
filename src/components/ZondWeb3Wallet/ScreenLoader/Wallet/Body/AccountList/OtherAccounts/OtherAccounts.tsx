import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/DropdownMenu";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  EllipsisVertical,
  Pencil,
  X,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AccountId from "../AccountId/AccountId";

type OtherAccountCardProps = {
  accountAddress: string;
  onSwitch: (address: string) => void;
  onCopy: (address: string) => void;
  onReceive: (address: string) => void;
};

const OtherAccountCard = observer(
  ({ accountAddress, onSwitch, onCopy, onReceive }: OtherAccountCardProps) => {
    const { t } = useTranslation();
    const { accountLabelsStore } = useStore();
    const label = accountLabelsStore.getLabel(accountAddress);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");

    const startEdit = () => {
      setEditValue(label);
      setIsEditing(true);
    };

    const cancelEdit = () => {
      setIsEditing(false);
    };

    const saveEdit = async () => {
      const trimmed = editValue.trim();
      if (trimmed) {
        await accountLabelsStore.setLabel(accountAddress, trimmed);
      }
      setIsEditing(false);
    };

    return (
      <Card className="flex flex-col gap-2 p-3 font-bold text-foreground">
        {isEditing && (
          <div className="flex items-center gap-1">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="h-6 w-32 text-xs"
              autoFocus
              maxLength={50}
              aria-label={t('home.editAccountLabel')}
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={saveEdit}
              aria-label={t('home.saveLabel')}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={cancelEdit}
              aria-label={t('home.cancelEdit')}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <AccountId account={accountAddress} hideLabel={isEditing} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical
                size="16"
                className="shrink-0 cursor-pointer"
                data-testid="account-menu"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer data-[highlighted]:text-secondary"
                  onClick={() => onSwitch(accountAddress)}
                >
                  <div className="flex gap-2">
                    <ArrowRight size="16" />
                    <span>{t('home.switch')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer data-[highlighted]:text-secondary"
                  onClick={() => onReceive(accountAddress)}
                >
                  <div className="flex gap-2">
                    <Download size="16" />
                    <span>{t('home.receive')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer data-[highlighted]:text-secondary"
                  onClick={() => onCopy(accountAddress)}
                >
                  <div className="flex gap-2">
                    <Copy size="16" />
                    <span>{t('home.copyAddress')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer data-[highlighted]:text-secondary"
                  onClick={startEdit}
                >
                  <div className="flex gap-2">
                    <Pencil size="16" />
                    <span>{t('home.rename')}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    );
  },
);

const OtherAccounts = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { zondStore } = useStore();
  const { zondAccounts, activeAccount, setActiveAccount } = zondStore;
  const { accountAddress: activeAccountAddress } = activeAccount;
  const { accounts } = zondAccounts;

  const otherAccountsLabel = activeAccountAddress
    ? t('home.otherAccountsLabel')
    : t('home.accountsLabel');
  const otherAccounts = accounts.filter(
    ({ accountAddress }) => accountAddress !== activeAccountAddress,
  );

  const copyAccount = (accountAddress: string) => {
    navigator.clipboard.writeText(accountAddress);
  };

  const receiveAccount = (accountAddress: string) => {
    navigate(ROUTES.RECEIVE, { state: { accountAddress } });
  };

  const onAccountSwitch = async (accountAddress: string) => {
    await StorageUtil.clearTransactionValues();
    navigate(ROUTES.HOME);
    await setActiveAccount(accountAddress);
  };

  return (
    !!otherAccounts.length && (
      <div className="flex flex-col gap-2">
        <Label className="text-lg">{otherAccountsLabel}</Label>
        {otherAccounts.map(({ accountAddress }) => (
          <OtherAccountCard
            key={accountAddress}
            accountAddress={accountAddress}
            onSwitch={onAccountSwitch}
            onCopy={copyAccount}
            onReceive={receiveAccount}
          />
        ))}
      </div>
    )
  );
});

export default OtherAccounts;
