import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardFooter } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import ChainBadge from "../../../Wallet/Header/ChainBadge/ChainBadge";
import WatchAssetInfo from "./WatchAssetInfo/WatchAssetInfo";
import StorageUtil from "@/utilities/storageUtil";

const WatchAssetContent = observer(() => {
  const { dAppRequestStore, zondStore } = useStore();
  const { activeAccount } = zondStore;
  const { accountAddress } = activeAccount;
  const {
    onPermission,
    approvalProcessingStatus,
    setOnPermissionCallBack,
    dAppRequestData,
  } = dAppRequestStore;
  const { isProcessing } = approvalProcessingStatus;

  const paramsObject = dAppRequestData?.params[0];
  const contractAddress = paramsObject?.options?.address ?? "";

  const addBlockchain = async () => {
    const onPermissionCallBack = async (hasApproved: boolean) => {
      if (hasApproved) {
        await StorageUtil.setTokenContractsList(
          accountAddress,
          contractAddress,
        );
      }
    };
    setOnPermissionCallBack(onPermissionCallBack);
    await onPermission(true);
  };

  return (
    <Card className="w-full">
      <div className="flex justify-center pt-6">
        <ChainBadge isDisabled={true} />
      </div>
      <div className="p-6">
        <div>Here is a request to add an ZRC20 token to the wallet.</div>
      </div>
      <CardContent className="space-y-6">
        <WatchAssetInfo />
        <div className="font-bold">Do you want to add this token?</div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          disabled={isProcessing}
          aria-label="No"
          onClick={() => onPermission(false)}
        >
          <X className="mr-2 h-4 w-4" />
          No
        </Button>
        <Button
          className="w-full"
          type="button"
          disabled={isProcessing}
          aria-label="Yes"
          onClick={() => addBlockchain()}
        >
          <Check className="mr-2 h-4 w-4" />
          Yes
        </Button>
      </CardFooter>
    </Card>
  );
});

export default WatchAssetContent;
