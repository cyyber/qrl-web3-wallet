import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { Link2 } from "lucide-react";
import { observer } from "mobx-react-lite";

const requestStatusClasses = cva("h-2 w-2 rounded-full", {
  variants: {
    requestStatus: {
      true: ["bg-constructive"],
      false: ["bg-destructive"],
    },
  },
  defaultVariants: {
    requestStatus: false,
  },
});

const DAppBadge = observer(() => {
  const { dAppRequestStore } = useStore();
  const { hasDAppRequest } = dAppRequestStore;

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 rounded-full text-xs text-foreground"
    >
      <Card
        className={requestStatusClasses({
          requestStatus: hasDAppRequest,
        })}
      />
      <Link2 className="h-3 w-3" />
    </Button>
  );
});

export default DAppBadge;
