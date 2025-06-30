import { ROUTES } from "@/router/router";
import { Link } from "react-router-dom";

const ZondWeb3WalletLogo = () => {
  return (
    <Link to={ROUTES.HOME}>
      <img
        className="h-6 w-6"
        src="icons/qrl/default.png"
        alt="Zond Web3 Wallet Logo"
      />
    </Link>
  );
};

export default ZondWeb3WalletLogo;
