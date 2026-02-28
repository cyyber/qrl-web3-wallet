import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { ShieldAlert } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import ZondRequestAccountContent from "./ZondRequestAccountContent/ZondRequestAccountContent";

const ZondRequestAccount = observer(() => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">{t('dapp.connectWithWallet')}</div>
      <ZondRequestAccountContent />
      <Alert className="mt-2">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>{t('common.careful')}</AlertTitle>
        <AlertDescription className="text-xs">
          {t('dapp.scamWarning')}
        </AlertDescription>
      </Alert>
    </div>
  );
});

export default ZondRequestAccount;
