import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { Wifi, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";

const connectivityStatusClasses = cva("h-3 w-3 rounded-full", {
  variants: {
    hasChainConnected: {
      true: ["bg-constructive"],
      false: ["bg-destructive"],
    },
    isLoading: {
      true: ["bg-secondary animate-ping"],
    },
  },
  defaultVariants: {
    hasChainConnected: false,
    isLoading: true,
  },
});

const ActiveChain = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { isLoading, isConnected, blockchain } = zondConnection;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Active chain</Label>
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Card
              className={connectivityStatusClasses({
                hasChainConnected: isConnected,
                isLoading,
              })}
            />
            {isConnected ? (
              // <img
              //   className="h-6 w-6"
              //   src={currentTabData?.favIconUrl}
              //   alt={currentTabData?.title}
              // />
              <Wifi className="h-6 w-6" />
            ) : (
              <WifiOff className="h-6 w-6" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold">{blockchain}</span>
            <span className="text-xm opacity-80">localhost:8080</span>
          </div>
        </div>
      </Card>
    </div>
  );
});

export default ActiveChain;
