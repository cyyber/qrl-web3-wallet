import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardFooter } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import AddZondChainInfo from "./AddZondChainInfo/AddZondChainInfo";

const AddZondChainContent = observer(() => {
  const { dAppRequestStore } = useStore();
  const { onPermission, approvalProcessingStatus } = dAppRequestStore;
  const { isProcessing } = approvalProcessingStatus;

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="mb-1 text-xs font-bold">Add new chain</div>
        <div>
          Here is a request to add the following blockchain to the wallet.
        </div>
      </div>
      <CardContent className="space-y-6">
        <AddZondChainInfo />
        <div className="font-bold">Do you want to add this chain?</div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          disabled={isProcessing}
          onClick={() => onPermission(false)}
        >
          <X className="mr-2 h-4 w-4" />
          No
        </Button>
        <Button
          className="w-full"
          type="button"
          disabled={isProcessing}
          onClick={() => onPermission(true)}
        >
          <Check className="mr-2 h-4 w-4" />
          Yes
        </Button>
      </CardFooter>
    </Card>
  );
});

export default AddZondChainContent;
