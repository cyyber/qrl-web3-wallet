import withSuspense from "@/functions/withSuspense";
import { useStore } from "@/stores/store";
import { Web3BaseWalletAccount } from "@theqrl/web3";
import { observer } from "mobx-react-lite";
import { lazy, useState } from "react";
import AccountCreationForm from "./AccountCreationForm/AccountCreationForm";
import AccountCreationSuccess from "./AccountCreationSuccess/AccountCreationSuccess";
import CircuitBackground from "../Shared/CircuitBackground/CircuitBackground";

const MnemonicDisplay = withSuspense(
  lazy(
    () =>
      import(
        "@/components/ZondWeb3Wallet/Wallet/Body/CreateAccount/MnemonicDisplay/MnemonicDisplay"
      ),
  ),
);

const CreateAccount = observer(() => {
  const { zondStore } = useStore();
  const { setActiveAccount } = zondStore;

  const [account, setAccount] = useState<Web3BaseWalletAccount>();
  const [hasAccountCreated, setHasAccountCreated] = useState(false);
  const [hasMnemonicNoted, setHasMnemonicNoted] = useState(false);

  const onAccountCreated = (account?: Web3BaseWalletAccount) => {
    window.scrollTo(0, 0);
    if (account) {
      setAccount(account);
      setActiveAccount(account?.address);
      setHasAccountCreated(true);
    }
  };

  const onMnemonicNoted = () => {
    window.scrollTo(0, 0);
    setHasMnemonicNoted(true);
  };

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 p-8">
        {hasAccountCreated ? (
          hasMnemonicNoted ? (
            <AccountCreationSuccess account={account} />
          ) : (
            <MnemonicDisplay
              account={account}
              onMnemonicNoted={onMnemonicNoted}
            />
          )
        ) : (
          <AccountCreationForm onAccountCreated={onAccountCreated} />
        )}
      </div>
    </>
  );
});

export default CreateAccount;
