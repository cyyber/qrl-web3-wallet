import { Checkbox } from "@/components/UI/Checkbox";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { observer } from "mobx-react-lite";

type ZondRequestAccountBlockchainSelectionProps = {
  isLoading: boolean;
  allBlockchains: BlockchainDataType[];
  selectedBlockchains: BlockchainDataType[];
  onBlockchainSelection: (
    selectedAccount: BlockchainDataType,
    checked: boolean,
  ) => void;
};

const ZondRequestAccountBlockchainSelection = observer(
  ({
    isLoading,
    allBlockchains,
    selectedBlockchains,
    onBlockchainSelection,
  }: ZondRequestAccountBlockchainSelectionProps) => {
    const hasBlockchains = !!allBlockchains?.length;

    return (
      <div className="flex flex-col gap-4">
        <div>Select the blockchains you want this site to use</div>
        {isLoading ? (
          <div className="flex h-12 w-full animate-pulse items-center justify-between">
            <div className="h-full w-full rounded-md bg-accent" />
          </div>
        ) : hasBlockchains ? (
          <div className="flex flex-col gap-2">
            {allBlockchains.map((blockchain) => (
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={blockchain.chainId}
                  checked={selectedBlockchains.includes(blockchain)}
                  onCheckedChange={(checked) =>
                    onBlockchainSelection(blockchain, !!checked)
                  }
                />
                <label
                  htmlFor={blockchain.chainId}
                  className="cursor-pointer text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                      {blockchain.chainName}
                    </div>
                    <div className="text-xs text-secondary">
                      {blockchain.chainId}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div>No blockchains available</div>
        )}
      </div>
    );
  },
);

export default ZondRequestAccountBlockchainSelection;
