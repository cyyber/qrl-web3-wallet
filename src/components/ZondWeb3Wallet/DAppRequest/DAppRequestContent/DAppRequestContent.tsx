import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import CircuitBackground from "../../Body/Shared/CircuitBackground/CircuitBackground";
import DAppRequestCompleted from "./DAppRequestCompleted/DAppRequestCompleted";
import DAppRequestConnectionNotAvailable from "./DAppRequestConnectionNotAvailable/DAppRequestConnectionNotAvailable";
import DAppRequestContentSelection from "./DAppRequestContentSelection/DAppRequestContentSelection";

const DAppRequestContent = observer(() => {
  const { zondStore, dAppRequestStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected } = zondConnection;
  const { approvalProcessingStatus } = dAppRequestStore;
  const { hasCompleted } = approvalProcessingStatus;

  if (isLoading) {
    return (
      <div className="flex justify-center pt-48">
        <Loader className="animate-spin" size={86} />
      </div>
    );
  }

  if (!isConnected) {
    return <DAppRequestConnectionNotAvailable />;
  }

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 flex flex-col items-center space-y-4 p-4">
        {hasCompleted ? (
          <DAppRequestCompleted />
        ) : (
          <DAppRequestContentSelection />
        )}
      </div>
    </>
  );
});

export default DAppRequestContent;
