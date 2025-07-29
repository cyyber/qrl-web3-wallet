import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import DAppRequestConnectionNotAvailable from "./DAppRequestConnectionNotAvailable/DAppRequestConnectionNotAvailable";
import DAppRequestContentSelection from "./DAppRequestContentSelection/DAppRequestContentSelection";
import { useEffect } from "react";
import CircuitBackground from "../../Wallet/Body/Shared/CircuitBackground/CircuitBackground";

const DAppRequestContent = observer(() => {
  const { zondStore, dAppRequestStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected } = zondConnection;
  const { approvalProcessingStatus } = dAppRequestStore;
  const { hasCompleted } = approvalProcessingStatus;

  useEffect(() => {
    if (hasCompleted) {
      window.close();
    }
  }, [hasCompleted]);

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
        <DAppRequestContentSelection />
      </div>
    </>
  );
});

export default DAppRequestContent;
