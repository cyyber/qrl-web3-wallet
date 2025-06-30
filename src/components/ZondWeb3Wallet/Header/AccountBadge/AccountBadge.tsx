import { Button } from "@/components/UI/Button";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { Wallet } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

const AccountBadge = observer(() => {
  const { zondStore } = useStore();
  const {
    activeAccount: { accountAddress },
  } = zondStore;

  const { prefix, addressSplit } = StringUtil.getSplitAddress(accountAddress);
  const account = `${prefix}${addressSplit[0]}...${addressSplit[addressSplit.length - 1]}`;

  return (
    !!accountAddress && (
      <Link to={ROUTES.ACCOUNT_LIST}>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full text-xs text-foreground"
        >
          <Wallet className="h-3 w-3" />
          {account}
        </Button>
      </Link>
    )
  );
});

export default AccountBadge;
