import BackButton from "../Shared/BackButton/BackButton";
import ActiveChain from "./ActiveChain/ActiveChain";
import OtherChains from "./OtherChains/OtherChains";

const ChainConnectivity = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <BackButton />
      <div className="flex flex-col gap-8">
        <ActiveChain />
        <OtherChains />
      </div>
    </div>
  );
};

export default ChainConnectivity;
