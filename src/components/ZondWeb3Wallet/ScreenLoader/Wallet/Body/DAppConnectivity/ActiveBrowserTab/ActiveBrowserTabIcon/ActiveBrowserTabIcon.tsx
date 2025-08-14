import { Earth } from "lucide-react";

type ActiveBrowserTabIconProps = {
  favIconUrl?: string;
  altText?: string;
};

const ActiveBrowserTabIcon = ({
  favIconUrl,
  altText,
}: ActiveBrowserTabIconProps) => {
  if (!favIconUrl) {
    return <Earth className="h-6 w-6" />;
  }

  return (
    <div className="h-6 w-6">
      <img src={favIconUrl} alt={altText} />
    </div>
  );
};

export default ActiveBrowserTabIcon;
