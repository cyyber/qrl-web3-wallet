import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import LockPasswordCheck from "./LockPasswordCheck/LockPasswordCheck";
import Onboarding from "./Onboarding/Onboarding";

const LockPassword = observer(() => {
  const { lockStore } = useStore();
  const { hasPasswordSet, isLocked } = lockStore;

  const [isOnboarding, setIsOnboarding] = useState(false);

  useEffect(() => {
    const onboardingHash = "#onboarding";
    const windowHash = window?.location?.hash;
    if (!hasPasswordSet) {
      if (windowHash === onboardingHash) {
        setIsOnboarding(true);
      } else if (windowHash !== onboardingHash) {
        browser.tabs.create({
          url: browser.runtime.getURL(`index.html${onboardingHash}`),
        });
      }
    }
  }, []);

  if (isOnboarding) return <Onboarding />;

  if (!isLocked || !hasPasswordSet) return;

  if (hasPasswordSet) return <LockPasswordCheck />;

  return;
});

export default LockPassword;
