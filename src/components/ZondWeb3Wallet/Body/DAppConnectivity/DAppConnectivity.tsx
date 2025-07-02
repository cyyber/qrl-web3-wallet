import { useEffect, useState } from "react";
import BackButton from "../Shared/BackButton/BackButton";
import browser from "webextension-polyfill";

const DAppConnectivity = () => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((value) => {
      console.log(">>>>value", value);
      setCurrentUrl(value[0].url ?? "not defined");
    });
  }, []);

  return (
    <div className="flex flex-col gap-2 p-8">
      <BackButton />
      <div className="flex flex-col gap-4">{currentUrl}</div>
    </div>
  );
};

export default DAppConnectivity;
