import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import BackButton from "../Shared/BackButton/BackButton";

const ChainConnectivity = observer(() => {
  const { zondStore } = useStore();
  const { zondConnection } = zondStore;
  const { blockchain } = zondConnection;

  return (
    <div className="flex flex-col gap-2 p-8">
      <BackButton />
      <div className="flex flex-col gap-4">Chain connected: {blockchain}</div>
    </div>
  );
});

export default ChainConnectivity;
