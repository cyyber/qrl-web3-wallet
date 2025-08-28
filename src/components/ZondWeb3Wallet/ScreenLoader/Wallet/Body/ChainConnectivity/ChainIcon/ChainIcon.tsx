import { getRandomTailwindTextColor } from "@/utilities/stylingUtil";
import { cva } from "class-variance-authority";
import { Network } from "lucide-react";
import { has } from "mobx";
import { useMemo, useState } from "react";

const chainIconClasses = cva("h-6 w-6 flex-shrink-0", {
  variants: {
    shouldDisplayFallback: {
      true: ["hidden"],
      false: ["block"],
    },
  },
  defaultVariants: {
    shouldDisplayFallback: false,
  },
});

type ChainIconType = {
  src: string;
  alt: string;
};

const ChainIcon = ({ src, alt }: ChainIconType) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSrcError, setHasSrcError] = useState(false);

  const shouldDisplayFallback = useMemo(
    () => isLoading || hasSrcError,
    [isLoading, has],
  );

  return (
    <>
      {shouldDisplayFallback && (
        <Network
          className={`h-6 w-6 flex-shrink-0 ${getRandomTailwindTextColor(alt)}`}
          data-testid="network-icon"
        />
      )}
      <img
        className={chainIconClasses({ shouldDisplayFallback })}
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasSrcError(true);
        }}
      />
    </>
  );
};

export default ChainIcon;
