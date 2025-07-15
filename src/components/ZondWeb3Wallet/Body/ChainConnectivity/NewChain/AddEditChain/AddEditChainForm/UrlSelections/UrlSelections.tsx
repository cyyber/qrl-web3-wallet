import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import { cva } from "class-variance-authority";
import { Star, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import AddUrlItem from "./AddUrlItem/AddUrlItem";

const defaultIconClasses = cva("", {
  variants: {
    isDefault: {
      true: ["text-secondary fill-secondary"],
    },
  },
  defaultVariants: {
    isDefault: false,
  },
});

type UrlSelectionsProps = {
  title: string;
  urls: string[];
  defaultUrl: string;
  canBeEmpty: boolean;
};

const UrlSelections = ({
  title,
  urls,
  defaultUrl,
  canBeEmpty,
}: UrlSelectionsProps) => {
  const [urlList, setUrlList] = useState<string[]>([]);
  const [defaultSelection, setDefaultSelection] = useState("");

  useEffect(() => {
    setUrlList(urls);
  }, [urls]);

  useEffect(() => {
    setDefaultSelection(defaultUrl);
  }, [defaultUrl]);

  const addUrl = (url: string) => {
    setUrlList([...urlList, url]);
  };

  const deleteUrl = (url: string) => {
    const updatedList = urlList.filter((urlItem) => urlItem !== url);
    setUrlList(updatedList);
    const firstItem = updatedList.at(0) ?? "";
    setDefaultSelection(
      updatedList.find((urlItem) => urlItem === defaultSelection) ?? firstItem,
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{title}</Label>
      <div className="flex flex-col gap-2">
        <AddUrlItem addUrl={addUrl} />
        {urlList.map((urlItem) => {
          return (
            <Card className="flex justify-between gap-2 rounded-md p-2">
              <div className="break-all">{urlItem}</div>
              <div className="flex shrink-0 gap-2">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      className="size-7 hover:bg-accent hover:text-secondary"
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => setDefaultSelection(urlItem)}
                    >
                      <Star
                        size="16"
                        className={defaultIconClasses({
                          isDefault: urlItem === defaultSelection,
                        })}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <Label>Default URL</Label>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      className="size-7 hover:bg-accent hover:text-secondary"
                      variant="outline"
                      disabled={!canBeEmpty && urlList.length === 1}
                      size="icon"
                      type="button"
                      onClick={() => {
                        deleteUrl(urlItem);
                      }}
                    >
                      <Trash size="16" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <Label>Delete URL</Label>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UrlSelections;
