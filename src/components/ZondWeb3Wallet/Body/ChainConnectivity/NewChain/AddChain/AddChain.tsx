import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { DEFAULT_BLOCKCHAIN } from "@/configuration/zondBlockchainConfig";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import BackButton from "../../../Shared/BackButton/BackButton";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";
import { Label } from "@/components/UI/Label";

const FormSchema = z.object({
  chainName: z.string().min(1, "Chain name is required"),
  chainId: z.coerce.number().gt(0, "Chain ID should be positive"),
  currencyName: z.string().min(1, "Currency name is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  currencyDecimals: z.coerce.number().gt(0, "Decimals should be positive"),
});
// .refine((fields) => fields.password === fields.reEnteredPassword, {
//   message: "Passwords doesn't match",
//   path: ["reEnteredPassword"],
// });

const AddChain = observer(() => {
  const { zondStore } = useStore();
  const { addBlockchain } = zondStore;
  const navigate = useNavigate();
  const { state } = useLocation();
  const hasState = !!state?.hasState;
  const chainIdToEdit: string = state?.chainId;
  const hasChainIdToEdit = !!chainIdToEdit;
  const labelText = hasChainIdToEdit ? "Edit chain" : "Add chain";

  // const [blockchain, setBlockchain] = useState<BlockchainDataType>({
  //   chainName: "",
  //   chainId: "",
  //   rpcUrls: [],
  //   blockExplorerUrls: [],
  //   iconUrls: [],
  //   nativeCurrency: { name: "", symbol: "", decimals: 18 },
  //   isTestnet: true,
  //   defaultRpcUrl: "",
  //   defaultBlockExplorerUrl: "",
  //   defaultIconUrl: "",
  //   defaultWsRpcUrl: "",
  //   isZondChain: false,
  // });

  useEffect(() => {
    if (!hasState) {
      navigate(ROUTES.CHAIN_CONNECTIVITY);
    }
  }, [hasState]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      chainName: "",
      chainId: undefined,
      currencyName: "",
      currencySymbol: "",
      currencyDecimals: undefined,
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    console.log(">>>>formData", formData);
    await addBlockchain({
      ...DEFAULT_BLOCKCHAIN,
      chainName: "Binance",
      chainId: "0x5",
    });
  }

  return (
    <>
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <Form {...form}>
          <BackButton />
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{labelText}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={control}
                  name="chainName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Chain name</Label>
                      <FormControl>
                        <Input
                          {...field}
                          aria-label={field.name}
                          disabled={isSubmitting}
                          placeholder="Zond customnet"
                          type="text"
                        />
                      </FormControl>
                      <FormDescription>Blockchain name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="chainId"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Chain ID</Label>
                      <FormControl>
                        <Input
                          {...field}
                          aria-label={field.name}
                          disabled={isSubmitting}
                          placeholder="111"
                          type="number"
                        />
                      </FormControl>
                      <FormDescription>Unique chain ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="currencyName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Currency name</Label>
                      <FormControl>
                        <Input
                          {...field}
                          aria-label={field.name}
                          disabled={isSubmitting}
                          placeholder="ZND"
                          type="text"
                        />
                      </FormControl>
                      <FormDescription>
                        Curreny of this blockchain
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={control}
                    name="currencySymbol"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Symbol</Label>
                        <FormControl>
                          <Input
                            {...field}
                            aria-label={field.name}
                            autoComplete="off"
                            disabled={isSubmitting}
                            placeholder="ZND"
                            type="text"
                          />
                        </FormControl>
                        <FormDescription>Currency symbol</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="currencyDecimals"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Decimals</Label>
                        <FormControl>
                          <Input
                            {...field}
                            aria-label={field.name}
                            autoComplete="off"
                            disabled={isSubmitting}
                            placeholder="18"
                            type="number"
                          />
                        </FormControl>
                        <FormDescription>Currency decimals</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={isSubmitting || !isValid}
                  className="w-full"
                  type="submit"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {labelText}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
});

export default AddChain;
