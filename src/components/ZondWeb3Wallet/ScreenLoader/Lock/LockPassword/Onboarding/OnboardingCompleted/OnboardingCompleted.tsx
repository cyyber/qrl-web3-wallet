import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { Check } from "lucide-react";
import { observer } from "mobx-react-lite";

const videoClasses = cva("w-full scale-[2.5]", {
  variants: {
    isDarkMode: {
      true: ["rotate-90"],
      false: ["rotate-180"],
    },
  },
  defaultVariants: {
    isDarkMode: false,
  },
});

const OnboardingCompleted = observer(() => {
  const { settingsStore } = useStore();
  const { isDarkMode, theme } = settingsStore;

  const videoSource = "qrl-video-".concat(theme).concat(".mp4");

  return (
    <Card className="animate-appear-in shadow-xl">
      <CardHeader>
        <CardTitle>That's All</CardTitle>
        <CardDescription className="break-words">
          The Zond Web3 Wallet is now ready for use.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-32 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 flex flex-col justify-end text-lg text-secondary">
            <div className="opacity-50">We are</div>
            <div className="font-bold">The Quantum</div>
            <div className="font-bold">Resistant Ledger</div>
          </div>
          <video autoPlay muted loop className={videoClasses({ isDarkMode })}>
            <source src={videoSource} type="video/mp4" />
          </video>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => window.close()}>
          <Check className="mr-2 h-4 w-4" />
          Close
        </Button>
      </CardFooter>
    </Card>
  );
});

export default OnboardingCompleted;
