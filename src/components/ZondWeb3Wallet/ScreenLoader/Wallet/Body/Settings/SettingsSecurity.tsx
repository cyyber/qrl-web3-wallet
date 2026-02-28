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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";

const SettingsSecurity = observer(() => {
  const navigate = useNavigate();
  const { settingsStore, priceStore } = useStore();
  const { t } = useTranslation();
  const { autoLockMinutes, setAutoLockMinutes, showBalanceAndPrice, setShowBalanceAndPrice } =
    settingsStore;

  const AUTO_LOCK_OPTIONS = [
    { value: "1", label: t("settings.security.1minute") },
    { value: "5", label: t("settings.security.5minutes") },
    { value: "15", label: t("settings.security.15minutes") },
    { value: "30", label: t("settings.security.30minutes") },
    { value: "60", label: t("settings.security.60minutes") },
    { value: "0", label: t("settings.security.never") },
  ];

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
              {t("settings.security.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">
                {t("settings.security.autoLockLabel")}
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
                  {t("settings.security.showBalanceLabel")}
                </Label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("settings.security.showBalanceDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SettingsSecurity;
