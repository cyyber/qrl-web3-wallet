import { observer } from "mobx-react-lite";
import LockPasswordSetup from "./LockPasswordSetup/LockPasswordSetup";

const Onboarding = observer(() => {
  return (
    <div>
      <div>Onboarding</div>
      <LockPasswordSetup />
    </div>
  );
});

export default Onboarding;
