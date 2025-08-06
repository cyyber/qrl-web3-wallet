import { Loader } from "lucide-react";
import CircuitBackground from "../Shared/CircuitBackground/CircuitBackground";

const ScreenLoading = () => {
  return (
    <>
      <CircuitBackground />
      <div className="flex justify-center pt-48">
        <Loader className="animate-spin" size={86} data-testid="loader-icon" />
      </div>
    </>
  );
};

export default ScreenLoading;
