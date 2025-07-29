import { Button } from "@/components/UI/Button";
import { useStore } from "@/stores/store";
import { Loader, X } from "lucide-react";
import { observer } from "mobx-react-lite";

const DAppRequestConnectionNotAvailable = observer(() => {
  const { dAppRequestStore } = useStore();
  const { onPermission, approvalProcessingStatus } = dAppRequestStore;
  const { isProcessing, hasApproved } = approvalProcessingStatus;
  const isRejectionProcessing = isProcessing && !hasApproved;

  return (
    <div className="flex flex-col items-center gap-4 pt-48">
      <div className="text-sm">Connection not available!</div>
      <Button
        className="w-24"
        variant="outline"
        type="button"
        disabled={isProcessing}
        onClick={async () => {
          await onPermission(false);
          window.close();
        }}
      >
        {isRejectionProcessing ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <X className="mr-2 h-4 w-4" />
        )}
        Close
      </Button>
    </div>
  );
});

export default DAppRequestConnectionNotAvailable;
