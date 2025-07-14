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
import { Label } from "@/components/UI/Label";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { ROUTES } from "@/router/router";
import StorageUtil from "@/utilities/storageUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Pencil, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type AddEditChainFormType = {
  chainToEdit?: BlockchainDataType;
};

const FormSchema = z.object({
  chainName: z.string().min(1, "Chain name is required"),
  chainId: z.coerce.number().gt(0, "Chain ID should be positive"),
  currencyName: z.string().min(1, "Currency name is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  currencyDecimals: z.coerce.number().gt(0, "Decimals should be positive"),
});

const AddEditChainForm = observer(({ chainToEdit }: AddEditChainFormType) => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const isChainEdit = !!chainToEdit;
  const labelText = isChainEdit ? "Edit chain" : "Add chain";
  const buttonSubmittingText = isChainEdit ? "Editing chain" : "Adding chain";
  const isCustomChain = chainToEdit?.isCustomChain ?? true;

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

  useEffect(() => {
    if (isChainEdit) {
      form.reset({
        chainName: chainToEdit.chainName,
        chainId: parseInt(chainToEdit.chainId, 16),
        currencyName: chainToEdit.nativeCurrency.name,
        currencySymbol: chainToEdit.nativeCurrency.symbol,
        currencyDecimals: chainToEdit.nativeCurrency.decimals,
      });
    }
  }, [isChainEdit, chainToEdit, form]);

  const addchain = async (formData: z.infer<typeof FormSchema>) => {
    const blockchains = await StorageUtil.getAllBlockChains();
    const chainFound = blockchains.find(
      (chain) => chain.chainId.toLowerCase() === newChain.chainId.toLowerCase(),
    );
    if (chainFound) {
      setError(
        `A blockchain with the chain ID ${formData.chainId} already exist.`,
      );
      return;
    }
    const newChain = {
      chainName: formData.chainName,
      chainId: "0x".concat(formData.chainId.toString(16)),
      nativeCurrency: {
        name: formData.currencyName,
        symbol: formData.currencySymbol,
        decimals: formData.currencyDecimals,
      },
      isCustomChain: true,
      isTestnet: false,
      rpcUrls: [],
      blockExplorerUrls: [],
      iconUrls: [],
      defaultRpcUrl: "",
      defaultBlockExplorerUrl: "",
      defaultIconUrl: "",
      defaultWsRpcUrl: "",
    };

    await StorageUtil.setAllBlockChains([...blockchains, newChain]);
    navigate(ROUTES.CHAIN_CONNECTIVITY);
  };

  const editChain = async (formData: z.infer<typeof FormSchema>) => {
    const editedChain = {
      chainName: formData.chainName,
      chainId: "0x".concat(formData.chainId.toString(16)),
      nativeCurrency: {
        name: formData.currencyName,
        symbol: formData.currencySymbol,
        decimals: formData.currencyDecimals,
      },
    };
    const blockchains = await StorageUtil.getAllBlockChains();
    const updatedChains = blockchains.map((chain) =>
      chain.chainId.toLowerCase() === editedChain.chainId.toLowerCase()
        ? { ...chain, ...editedChain }
        : chain,
    );

    await StorageUtil.setAllBlockChains(updatedChains);
    navigate(ROUTES.CHAIN_CONNECTIVITY);
  };

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setError("");
    if (isChainEdit) {
      await editChain(formData);
    } else {
      await addchain(formData);
    }
  }

  return (
    <Form {...form}>
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
                      autoComplete="off"
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
                      autoComplete="off"
                      disabled={isSubmitting || isChainEdit}
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
                      autoComplete="off"
                      disabled={isSubmitting || !isCustomChain}
                      placeholder="ZND"
                      type="text"
                    />
                  </FormControl>
                  <FormDescription>Curreny of this blockchain</FormDescription>
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
                        disabled={isSubmitting || !isCustomChain}
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
                        disabled={isSubmitting || !isCustomChain}
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
            {error && (
              <div className="text-sm font-bold text-destructive">{error}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              disabled={isSubmitting || !isValid}
              className="w-full"
              type="submit"
            >
              {isSubmitting ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : isChainEdit ? (
                <Pencil className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? buttonSubmittingText : labelText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
});

export default AddEditChainForm;
