import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { Earth } from "lucide-react";
import { observer } from "mobx-react-lite";

const connectivityStatusClasses = cva("h-3 w-3 rounded-full", {
  variants: {
    hasDAppConnected: {
      true: ["bg-constructive"],
      false: ["bg-destructive"],
    },
  },
  defaultVariants: {
    hasDAppConnected: false,
  },
});

const ActiveBrowserTab = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppConnected, currentTabData } = dAppRequestStore;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Active browser tab</Label>
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Card
              className={connectivityStatusClasses({
                hasDAppConnected,
              })}
            />
            {currentTabData?.favIconUrl ? (
              <img
                className="h-6 w-6"
                src={currentTabData?.favIconUrl}
                alt={currentTabData?.title}
              />
            ) : (
              <Earth className="h-6 w-6" />
            )}
          </div>
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
