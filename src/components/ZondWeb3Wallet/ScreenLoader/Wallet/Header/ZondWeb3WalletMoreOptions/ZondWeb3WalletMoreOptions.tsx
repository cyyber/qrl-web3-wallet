import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/DropdownMenu";
import { APP_INDEX_FILE } from "@/constants/zondWeb3Wallet";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import {
  BookUser,
  EllipsisVertical,
  Expand,
  LockKeyhole,
  Settings,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import browser from "webextension-polyfill";

const ZondWeb3WalletMoreOptions = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lockStore, settingsStore } = useStore();
  const { isPopupWindow } = settingsStore;
  const { lock } = lockStore;

  const openInTab = () => {
    browser.tabs.create({
      url: browser.runtime.getURL(APP_INDEX_FILE),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical
          size="16"
          className="cursor-pointer"
          data-testid="ellipsis-icon"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {isPopupWindow && (
            <DropdownMenuItem
              className="cursor-pointer data-[highlighted]:text-secondary"
              onClick={openInTab}
            >
              <div className="flex gap-2">
                <Expand size="16" />
                <button aria-label="Open in tab">{t('header.openInTab')}</button>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer data-[highlighted]:text-secondary"
            onClick={() => navigate(ROUTES.CONTACTS)}
          >
            <div className="flex gap-2">
              <BookUser size="16" />
              <button aria-label="Contacts">{t('header.contacts')}</button>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer data-[highlighted]:text-secondary"
            onClick={() => navigate(ROUTES.SETTINGS)}
          >
            <div className="flex gap-2">
              <Settings size="16" />
              <button aria-label="Settings">{t('header.settings')}</button>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer data-[highlighted]:text-secondary"
            onClick={lock}
          >
            <div className="flex gap-2">
              <LockKeyhole size="16" />
              <button aria-label="Lock Wallet">{t('header.lockWallet')}</button>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ZondWeb3WalletMoreOptions;
