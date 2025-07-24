import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";

const AddZondChainContent = observer(() => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;
  const method = dAppRequestData?.method ?? "";

  return <div>Add zond chain content for {method}</div>;
});

export default AddZondChainContent;
