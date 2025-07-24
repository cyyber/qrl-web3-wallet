import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import PermissionRequiredContent from "./PermissionRequiredContent/PermissionRequiredContent";
import { RESTRICTED_METHODS } from "@/scripts/constants/requestConstants";

const PERMISSION_REQUIRED_METHODS: string[] = [
  RESTRICTED_METHODS.PERSONAL_SIGN,
  RESTRICTED_METHODS.ZOND_REQUEST_ACCOUNTS,
  RESTRICTED_METHODS.ZOND_SEND_TRANSACTION,
  RESTRICTED_METHODS.ZOND_SIGN_TYPED_DATA_V4,
];

const DAppRequestContentSelection = observer(() => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;
  const method = dAppRequestData?.method ?? "";

  if (PERMISSION_REQUIRED_METHODS.includes(method))
    return <PermissionRequiredContent />;
});

export default DAppRequestContentSelection;
