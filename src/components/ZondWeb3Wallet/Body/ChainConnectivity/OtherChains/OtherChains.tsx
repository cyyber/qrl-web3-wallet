import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import { WifiOff } from "lucide-react";

const OtherChains = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg">Other chains</Label>
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <WifiOff className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">chain 1</span>
            <span className="text-xm opacity-80">chain1.chain.com:8081</span>
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <WifiOff className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">chain 2</span>
            <span className="text-xm opacity-80">chain2.chain.com:8081</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OtherChains;
