import { getRandomTailwindTextColor } from "@/utilities/stylingUtil";
import { TextSelect } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

type TokenListItemIconProps = {
  icon?: string;
  symbol: string;
};

const TokenListItemIcon = observer(
  ({ icon, symbol }: TokenListItemIconProps) => {
    const [hasSrcError, setHasSrcError] = useState(false);

    return hasSrcError ? (
      <span className={getRandomTailwindTextColor(symbol)}>
        <TextSelect size={32} />
      </span>
    ) : (
      <img
        className="h-8 w-8"
        src={icon ?? ""}
        onError={() => setHasSrcError(true)}
      />
    );
  },
);

export default TokenListItemIcon;
