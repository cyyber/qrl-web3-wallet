import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ZondRequestAccountAccountSelection from "./ZondRequestAccountAccountSelection/ZondRequestAccountAccountSelection";
import ZondRequestAccountBlockchainSelection from "./ZondRequestAccountBlockchainSelection/ZondRequestAccountBlockchainSelection";
import StorageUtil from "@/utilities/storageUtil";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";

const ZondRequestAccountContent = observer(() => {
  const { dAppRequestStore } = useStore();
  const { addToResponseData, setCanProceed } = dAppRequestStore;

  const [isLoadingBlockchains, setIsLoadingBlockchains] = useState(true);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [allBlockchains, setAllBlockchains] = useState<BlockchainDataType[]>(
    [],
  );
  const [blockchains, setBlockchains] = useState<BlockchainDataType[]>([]);

  useEffect(() => {
    (async () => {
      const allBlockchains = await StorageUtil.getAllBlockChains();
      setAllBlockchains(allBlockchains);
      setIsLoadingBlockchains(false);
    })();
  }, []);

  useEffect(() => {
    addToResponseData({
      accounts,
      blockchains,
    });
    setCanProceed(!!accounts.length && !!blockchains.length);
  }, [accounts, blockchains]);

  const onAccountSelection = (selectedAccount: string, checked: boolean) => {
    let updatedAccounts = accounts;
    if (checked) {
      updatedAccounts = Array.from(
        new Set([...updatedAccounts, selectedAccount]),
      );
    } else {
      updatedAccounts = updatedAccounts.filter(
        (account) => account !== selectedAccount,
      );
    }
    setAccounts(updatedAccounts);
  };

  const onBlockchainSelection = (
    selectedBlockchain: BlockchainDataType,
    checked: boolean,
  ) => {
    let updatedBlockchains = blockchains;
    if (checked) {
      updatedBlockchains = Array.from(
        new Set([...updatedBlockchains, selectedBlockchain]),
      );
    } else {
      updatedBlockchains = updatedBlockchains.filter(
        (blockchain) => blockchain.chainId !== selectedBlockchain.chainId,
      );
    }
    setBlockchains(updatedBlockchains);
  };

  return (
    <Tabs defaultValue="accounts">
      <TabsList className="w-full">
        <TabsTrigger
          value="accounts"
          className="w-full data-[state=active]:text-secondary"
        >
          Accounts
        </TabsTrigger>
        <TabsTrigger
          value="blockchains"
          className="w-full data-[state=active]:text-secondary"
        >
          Blockchains
        </TabsTrigger>
      </TabsList>
      <TabsContent value="accounts" className="rounded-md p-2">
        <ZondRequestAccountAccountSelection
          selectedAccounts={accounts}
          onAccountSelection={onAccountSelection}
        />
      </TabsContent>
      <TabsContent value="blockchains" className="rounded-md p-2">
        <ZondRequestAccountBlockchainSelection
          isLoading={isLoadingBlockchains}
          allBlockchains={allBlockchains}
          selectedBlockchains={blockchains}
          onBlockchainSelection={onBlockchainSelection}
        />
      </TabsContent>
    </Tabs>
  );
});

export default ZondRequestAccountContent;
