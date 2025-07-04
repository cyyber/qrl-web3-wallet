import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import { useStore } from "@/stores/store";
import { Earth } from "lucide-react";
import { observer } from "mobx-react-lite";

const ActiveBrowserTab = observer(() => {
  const { dAppRequestStore } = useStore();
  const { currentTabData } = dAppRequestStore;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Active browser tab</Label>
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
            <span className="text-xm opacity-80">{currentTabData?.title}</span>
          </div>
        </div>
      </Card>
    </div>
  );
});

export default ActiveBrowserTab;
