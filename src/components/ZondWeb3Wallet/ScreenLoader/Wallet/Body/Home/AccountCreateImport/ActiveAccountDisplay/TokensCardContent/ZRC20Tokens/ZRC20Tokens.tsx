import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ZRC20Token from "./ZRC20Token/ZRC20Token";

type ZRC20TokensProps = {
  shouldDisplayAllTokens?: boolean;
};

const ZRC20Tokens = observer(
  ({ shouldDisplayAllTokens = false }: ZRC20TokensProps) => {
    const { zondStore } = useStore();
    const { activeAccount, zondConnection } = zondStore;
    const { accountAddress } = activeAccount;
    const { blockchain } = zondConnection;

    const [tokenContractsList, setTokenContractsList] = useState<string[]>([]);

    const numberOfTokens = tokenContractsList.length;
    const tokenDisplayLimit = 2;
    const displayLimit = shouldDisplayAllTokens
      ? numberOfTokens + 1
      : tokenDisplayLimit;

    useEffect(() => {
      (async () => {
        const storedTokens =
          await StorageUtil.getTokenContractsList(accountAddress);
        setTokenContractsList(storedTokens);
      })();
    }, [blockchain, accountAddress]);

    return (
      <>
        {tokenContractsList.slice(0, displayLimit).map((contractAddress) => (
          <ZRC20Token key={contractAddress} contractAddress={contractAddress} />
        ))}
      </>
    );
  },
);

export default ZRC20Tokens;
