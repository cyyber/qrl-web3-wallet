import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/DropdownMenu";
import { useStore } from "@/stores/store";
import { EllipsisVertical, LockKeyhole } from "lucide-react";
import { observer } from "mobx-react-lite";

const ZondWeb3WalletMoreOptions = observer(() => {
  const { lockStore } = useStore();
  const { lock } = lockStore;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical size="16" className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
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
