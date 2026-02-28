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
import { useNavigate } from "react-router-dom";
import browser from "webextension-polyfill";

const ZondWeb3WalletMoreOptions = observer(() => {
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
                <button aria-label="Open in tab">Open In Tab</button>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer data-[highlighted]:text-secondary"
            onClick={() => navigate(ROUTES.CONTACTS)}
          >
            <div className="flex gap-2">
              <BookUser size="16" />
              <button aria-label="Contacts">Contacts</button>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer data-[highlighted]:text-secondary"
            onClick={() => navigate(ROUTES.SETTINGS)}
          >
            <div className="flex gap-2">
              <Settings size="16" />
              <button aria-label="Settings">Settings</button>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer data-[highlighted]:text-secondary"
            onClick={lock}
          >
            <div className="flex gap-2">
              <LockKeyhole size="16" />
              <button aria-label="Lock Wallet">Lock Wallet</button>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ZondWeb3WalletMoreOptions;
