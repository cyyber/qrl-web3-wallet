import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/Dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/Tooltip";
import {
  BlockchainType,
  ZOND_BLOCKCHAIN,
} from "@/configuration/zondBlockchainConfig";
import { useStore } from "@/stores/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { cva } from "class-variance-authority";
import { HardDrive, Network, PlugZap, Workflow, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const networkStatusClasses = cva("h-2 w-2 rounded-full", {
  variants: {
    networkStatus: {
      true: ["bg-constructive"],
      false: ["bg-destructive"],
    },
    isLoading: {
      true: ["animate-ping"],
    },
  },
  defaultVariants: {
    networkStatus: false,
    isLoading: true,
  },
});

const getConnectionTypeIcon = (blockchain: string) => {
  switch (blockchain) {
    case ZOND_BLOCKCHAIN.TEST_NET.id:
      return <Workflow className="mr-1 h-3 w-3" />;
    case ZOND_BLOCKCHAIN.MAIN_NET.id:
      return <Network className="mr-1 h-3 w-3" />;
    default:
      return <HardDrive className="mr-1 h-3 w-3" />;
  }
};

type ChainBadgeProps = {
  isDisabled?: boolean;
  displayChainName?: boolean;
};

const FormSchema = z.object({
  ipAddress: z.string().min(1, "IP address is required"),
  port: z.string().min(1, "Port is required"),
});

const ChainBadge = observer(
  ({ isDisabled = false, displayChainName = true }: ChainBadgeProps) => {
    const { zondStore } = useStore();
    const { zondConnection, selectBlockchain } = zondStore;
    const {
      isLoading,
      isConnected,
      blockchain,
      ipAddress: ipAddressFromStorage,
      port: portFromStorage,
    } = zondConnection;

    const [selectedBlockchain, setSelectedBlockchain] = useState(blockchain);
    const [ipAddress, setIpAddress] = useState(
      ZOND_BLOCKCHAIN[blockchain].ipAddress,
    );
    const [port, setPort] = useState(ZOND_BLOCKCHAIN[blockchain].port);
    const [isValidationRequired, setIsValidationRequired] = useState(
      ZOND_BLOCKCHAIN[blockchain].isConfigurationRequired,
    );

    useEffect(() => {
      setIsValidationRequired(
        ZOND_BLOCKCHAIN[selectedBlockchain].isConfigurationRequired,
      );
      setIpAddress(ZOND_BLOCKCHAIN[selectedBlockchain].ipAddress);
      setPort(ZOND_BLOCKCHAIN[selectedBlockchain].port);
    }, [selectedBlockchain]);

    useEffect(() => {
      setValue("ipAddress", ipAddress);
      setValue("port", port);
    }, [ipAddress, port]);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
      await selectBlockchain({
        blockchain: selectedBlockchain,
        ipAddress: formData?.ipAddress ?? ipAddress,
        port: formData?.port ?? port,
        wsRpcIpAddress: ZOND_BLOCKCHAIN[selectedBlockchain].wsRpcIpAddress,
        wsRpcPort: ZOND_BLOCKCHAIN[selectedBlockchain].wsRpcPort,
      });
    }

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(
        z.object({
          ipAddress: z.string().min(1, "IP address is required"),
          port: z.string().min(1, "Port is required"),
        }),
      ),
      mode: "onChange",
      reValidateMode: "onSubmit",
      defaultValues: {
        ipAddress,
        port,
      },
    });

    const {
      handleSubmit,
      control,
      formState: { isSubmitting, isValid },
      setValue,
    } = form;

    return (
      <Form {...form}>
        <form name="chainBadgeForm" aria-label="chainBadgeForm">
          <Dialog
            onOpenChange={(open) => {
              if (open && isValidationRequired) {
                setIpAddress(ipAddressFromStorage);
                setPort(portFromStorage);
              }
            }}
          >
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <DialogTrigger asChild disabled={isLoading || isDisabled}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 rounded-full text-xs text-foreground"
                  >
                    <Card
                      className={networkStatusClasses({
                        networkStatus: isConnected,
                        isLoading,
                      })}
                    />
                    <PlugZap className="h-3 w-3" />
                    {displayChainName && ZOND_BLOCKCHAIN[blockchain].name}
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <Label>Chains</Label>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="w-80 rounded-md">
              <DialogHeader className="text-left">
                <DialogTitle>Select Blockchain</DialogTitle>
              </DialogHeader>
              <Tabs
                defaultValue={blockchain}
                onValueChange={(value) => {
                  setSelectedBlockchain(value as BlockchainType);
                }}
              >
                <TabsList className="grid w-full grid-cols-3">
                  {Object.values(ZOND_BLOCKCHAIN).map((provider) => {
                    return (
                      <TabsTrigger
                        key={provider.id}
                        value={provider.id}
                        className="data-[state=active]:text-secondary"
                      >
                        {getConnectionTypeIcon(provider.id)}
                        <span className="text-xs">{provider.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {Object.values(ZOND_BLOCKCHAIN).map((provider) => {
                  return (
                    <TabsContent
                      className="space-y-4"
                      key={provider.id}
                      value={provider.id}
                    >
                      {isValidationRequired &&
                        isConnected &&
                        provider.name === ZOND_BLOCKCHAIN[blockchain].name && (
                          <Card className="flex items-center gap-2 p-2 text-secondary">
                            <PlugZap />
                            <div className="flex flex-col">
                              <div>Currently connected to</div>
                              <div className="font-semibold">
                                {ipAddressFromStorage}:{portFromStorage}
                              </div>
                            </div>
                          </Card>
                        )}
                      <Card className="p-2">
                        <div className="space-y-4">
                          <div>{provider.description}</div>
                          {provider.isConfigurationRequired && (
                            <div className="space-y-4">
                              <FormField
                                control={control}
                                name="ipAddress"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        aria-label={field.name}
                                        disabled={isSubmitting}
                                        placeholder="http://127.0.0.1"
                                        type="text"
                                        autoComplete="off"
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Enter the IP address
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name="port"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        aria-label={field.name}
                                        disabled={isSubmitting}
                                        placeholder="8545"
                                        type="text"
                                        autoComplete="off"
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Enter the port number
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    </TabsContent>
                  );
                })}
              </Tabs>
              <DialogFooter className="flex flex-row gap-4">
                <DialogClose asChild>
                  <Button className="w-full" type="button" variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="w-full"
                  type="button"
                  disabled={isValidationRequired && (isSubmitting || !isValid)}
                  onClick={handleSubmit(onSubmit)}
                >
                  <PlugZap className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    );
  },
);

export default ChainBadge;
