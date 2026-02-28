import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { Checkbox } from "@/components/UI/Checkbox";
import { Label } from "@/components/UI/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/Select";
import { Separator } from "@/components/UI/Separator";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { MoveLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";

const AUTO_LOCK_OPTIONS = [
  { value: "1", label: "1 minute" },
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "0", label: "Never" },
];

const SettingsSecurity = observer(() => {
  const navigate = useNavigate();
  const { settingsStore, priceStore } = useStore();
  const { autoLockMinutes, setAutoLockMinutes, showBalanceAndPrice, setShowBalanceAndPrice } =
    settingsStore;

  const handleTogglePrice = (checked: boolean | "indeterminate") => {
    const enabled = checked === true;
    setShowBalanceAndPrice(enabled);
    if (enabled) {
      priceStore.fetchPrices();
      priceStore.startAutoRefresh();
    } else {
      priceStore.stopAutoRefresh();
    }
  };

  return (
    <div className="w-full">
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoveLeft
                className="cursor-pointer transition-all hover:text-secondary"
                onClick={() => navigate(ROUTES.SETTINGS)}
                data-testid="back-arrow"
              />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">
                Auto-lock timeout
              </Label>
              <Select
                value={String(autoLockMinutes)}
                onValueChange={(value) => setAutoLockMinutes(Number(value))}
              >
                <SelectTrigger aria-label="Auto-lock timeout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTO_LOCK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-balance-price"
                  checked={showBalanceAndPrice}
                  onCheckedChange={handleTogglePrice}
                />
                <Label htmlFor="show-balance-price" className="text-sm">
                  Show balance and token price
                </Label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                We use{" "}
                <a
                  href="https://www.coingecko.com/en/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  CoinGecko API
                </a>{" "}
                to display token prices. When disabled, no external API calls
                are made and no fiat values are shown.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SettingsSecurity;
