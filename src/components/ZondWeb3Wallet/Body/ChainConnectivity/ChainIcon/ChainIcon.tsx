import { Network } from "lucide-react";
import { useState } from "react";

type ChainIconType = {
  src: string;
  alt: string;
};

const ChainIcon = ({ src, alt }: ChainIconType) => {
  const [hasSrcError, setHasSrcError] = useState(false);

  return hasSrcError ? (
    <Network className="h-6 w-6" />
  ) : (
    <div className="h-6 w-6">
      <img src={src} alt={alt} onError={() => setHasSrcError(true)} />
    </div>
  );
};

export default ChainIcon;
