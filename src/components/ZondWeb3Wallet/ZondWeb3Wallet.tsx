import RouteMonitor from "@/components/ZondWeb3Wallet/RouteMonitor/RouteMonitor";
import ScreenLoader from "@/components/ZondWeb3Wallet/ScreenLoader/ScreenLoader";
import { TooltipProvider } from "../UI/Tooltip";

const ZondWeb3Wallet = () => {
  return (
    <div className="relative flex h-[48rem] w-[23rem] flex-col bg-background text-foreground">
      <RouteMonitor />
      <TooltipProvider>
        <ScreenLoader />
      </TooltipProvider>
    </div>
  );
};

export default ZondWeb3Wallet;
