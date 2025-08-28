import { getRandomTailwindTextColor } from "@/utilities/stylingUtil";
import { TextSelect } from "lucide-react";

type TokenDisplaySectionProps = {
  tokenImage: string;
  tokenSymbol: string;
  tokenName: string;
};

const TokenDisplaySection = ({
  tokenImage,
  tokenSymbol,
  tokenName,
}: TokenDisplaySectionProps) => {
  return (
    <div className="flex gap-6">
      {!!tokenImage ? (
        <img className="h-16 w-16" src={tokenImage} />
      ) : (
        <span className={getRandomTailwindTextColor(tokenSymbol)}>
          <TextSelect size={64} />
        </span>
      )}
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{tokenSymbol}</div>
        <div className="text-lg">{tokenName}</div>
      </div>
    </div>
  );
};

export default TokenDisplaySection;
