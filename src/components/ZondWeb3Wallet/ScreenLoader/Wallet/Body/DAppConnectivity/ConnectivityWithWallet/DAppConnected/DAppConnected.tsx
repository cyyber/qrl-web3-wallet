import { observer } from "mobx-react-lite";
import DAppConnectedAccounts from "./DAppConnectedAccounts/DAppConnectedAccounts";
import DAppConnectedBlockchains from "./DAppConnectedBlockchains/DAppConnectedBlockchains";

const DAppConnected = observer(() => {
  return (
    <div className="flex flex-col gap-4">
      <DAppConnectedAccounts />
      <DAppConnectedBlockchains />
    </div>
  );
});

export default DAppConnected;
