import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ZRC20Token from "./ZRC20Token/ZRC20Token";
import { ZRC_20_ITEMS_DISPLAY_LIMIT } from "@/constants/zrc20Token";

type ZRC20TokensProps = {
  shouldDisplayAllTokens?: boolean;
};

const ZRC20Tokens = observer(
  ({ shouldDisplayAllTokens = false }: ZRC20TokensProps) => {
    const { zondStore } = useStore();
    const { activeAccount, zondConnection } = zondStore;
    const { accountAddress } = activeAccount;
    const { blockchain } = zondConnection;

    const [reRender, setReRender] = useState(0);
    const [tokenContractsList, setTokenContractsList] = useState<string[]>([]);

    const numberOfTokens = tokenContractsList.length;
    const displayLimit = shouldDisplayAllTokens
      ? numberOfTokens + 1
      : ZRC_20_ITEMS_DISPLAY_LIMIT;

    useEffect(() => {
      (async () => {
        const storedTokens =
          await StorageUtil.getTokenContractsList(accountAddress);
        setTokenContractsList(storedTokens.map((token) => token?.address));
      })();
    }, [blockchain, accountAddress, reRender]);

    const triggerReRender = () => {
      setReRender(reRender + 1);
    };

    if (shouldDisplayAllTokens && !numberOfTokens) {
      return <div>There are no tokens.</div>;
    }

    return (
      <>
        {tokenContractsList.slice(0, displayLimit).map((contractAddress) => (
          <ZRC20Token
            key={contractAddress}
            contractAddress={contractAddress}
            triggerReRender={triggerReRender}
          />
        ))}
      </>
    );
  },
);

export default ZRC20Tokens;
