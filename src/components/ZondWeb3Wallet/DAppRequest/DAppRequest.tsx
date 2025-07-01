import { useStore } from "@/stores/store";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import DAppRequestContent from "./DAppRequestContent/DAppRequestContent";

const DAppRequest = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppRequest, readDAppRequestData } = dAppRequestStore;

  useEffect(() => {
    readDAppRequestData();
  }, []);

  return hasDAppRequest ? (
    <DAppRequestContent />
  ) : (
    <div className="flex justify-center pt-48">
      <Loader className="animate-spin" size={86} />
    </div>
  );
});

export default DAppRequest;
