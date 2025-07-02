import { Card } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { Earth } from "lucide-react";
import { observer } from "mobx-react-lite";
import BackButton from "../Shared/BackButton/BackButton";
import DAppConnected from "./DAppConnected/DAppConnected";
import DAppNotConnected from "./DAppNotConnected/DAppNotConnected";

const DAppConnectivity = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected, currentTabData } = dAppRequestStore;

  return (
    <div className="flex flex-col gap-2 p-8">
      <BackButton />
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-4">
            {currentTabData?.favIconUrl ? (
              <img
                className="h-6 w-6"
                src={currentTabData?.favIconUrl}
                alt={currentTabData?.title}
              />
            ) : (
              <Earth className="h-6 w-6" />
            )}
            <div className="flex flex-col">
              <span className="font-bold">{currentTabData?.urlOrigin}</span>
              <span className="text-xm opacity-80">
                {currentTabData?.title}
              </span>
            </div>
          </div>
        </Card>
        {hasDAppConnected ? <DAppConnected /> : <DAppNotConnected />}
      </div>
    </div>
  );
});

export default DAppConnectivity;
