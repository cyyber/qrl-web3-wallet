import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { MoveRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { ONBOARDING_STEPS, OnboardingStepType } from "../Onboarding";

type AddOrImportAccountProps = {
  selectStep: (step: OnboardingStepType) => void;
};

const AddOrImportAccount = observer(
  ({ selectStep }: AddOrImportAccountProps) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Or Import Accounts</CardTitle>
          <CardDescription>
            You can either add a new account, or import an existing account
            using your mnemonic phrases.
          </CardDescription>
        </CardHeader>
        <CardContent>content</CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            className="w-full"
            onClick={() => selectStep(ONBOARDING_STEPS.COMPLETED)}
          >
            <MoveRight className="mr-2 h-4 w-4" />
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  },
);

export default AddOrImportAccount;
