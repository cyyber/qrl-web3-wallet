import { observer } from "mobx-react-lite";
import LockPasswordSetup from "./LockPasswordSetup/LockPasswordSetup";
import { useState } from "react";
import Welcome from "./Welcome/Welcome";
import AddOrImportAccount from "./AddOrImportAccount/AddOrImportAccount";
import OnboardingCompleted from "./OnboardingCompleted/OnboardingCompleted";

export const ONBOARDING_STEPS = Object.freeze({
  WELCOME: "WELCOME",
  SET_PASSWORD: "SET_PASSWORD",
  ADD_OR_IMPORT_ACCOUNT: "ADD_OR_IMPORT_ACCOUNT",
  COMPLETED: "COMPLETED",
});

export type OnboardingStepType =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

const Onboarding = observer(() => {
  const [step, setStep] = useState<OnboardingStepType>(
    ONBOARDING_STEPS.WELCOME,
  );
  const [password, setPassword] = useState("");

  const selectStep = (step: OnboardingStepType) => {
    setStep(step);
  };

  const setNewPassword = (password: string) => {
    setPassword(password);
  };

  if (step === ONBOARDING_STEPS.WELCOME)
    return <Welcome selectStep={selectStep} />;

  if (step === ONBOARDING_STEPS.SET_PASSWORD)
    return (
      <LockPasswordSetup
        selectStep={selectStep}
        setNewPassword={setNewPassword}
      />
    );

  if (step === ONBOARDING_STEPS.ADD_OR_IMPORT_ACCOUNT)
    return <AddOrImportAccount selectStep={selectStep} />;

  if (step === ONBOARDING_STEPS.COMPLETED) return <OnboardingCompleted />;
});

export default Onboarding;
