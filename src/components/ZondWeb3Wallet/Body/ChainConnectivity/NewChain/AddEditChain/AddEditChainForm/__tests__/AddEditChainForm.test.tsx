import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { BlockchainDataType } from "@/configuration/zondBlockchainConfig";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import AddEditChainForm from "../AddEditChainForm";
import StorageUtil from "@/utilities/storageUtil";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getAllBlockChains: jest.fn(),
    setAllBlockChains: jest.fn(),
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/Body/ChainConnectivity/NewChain/AddEditChain/AddEditChainForm/UrlSelections/UrlSelections",
  () => () => <div>Mocked Url Selections</div>,
);

describe("AddEditChainForm", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof AddEditChainForm> = {
      chainToEdit: undefined,
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <AddEditChainForm {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add chain form component", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { level: 3, name: "Add chain" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Chain name")).toBeInTheDocument();
    const chainNameField = screen.getByRole("textbox", { name: "chainName" });
    expect(chainNameField).toBeInTheDocument();
    expect(chainNameField).toBeEnabled();
    expect(chainNameField).toHaveValue("");
    expect(chainNameField).toHaveAttribute("placeholder", "Zond customnet");
    expect(screen.getByText("Blockchain name")).toBeInTheDocument();

    expect(screen.getByText("Chain ID")).toBeInTheDocument();
    const chainIdField = screen.getByRole("spinbutton", { name: "chainId" });
    expect(chainIdField).toBeInTheDocument();
    expect(chainIdField).toBeEnabled();
    expect(chainIdField).toHaveValue(null);
    expect(chainIdField).toHaveAttribute("placeholder", "111");
    expect(screen.getByText("Unique chain ID")).toBeInTheDocument();

    expect(screen.getAllByText("Mocked Url Selections")).toHaveLength(3);

    expect(screen.getByText("Currency name")).toBeInTheDocument();
    const currencyName = screen.getByRole("textbox", { name: "currencyName" });
    expect(currencyName).toBeInTheDocument();
    expect(currencyName).toBeEnabled();
    expect(currencyName).toHaveValue("");
    expect(currencyName).toHaveAttribute("placeholder", "ZND");
    expect(screen.getByText("Currency of this blockchain")).toBeInTheDocument();

    expect(screen.getByText("Symbol")).toBeInTheDocument();
    const currencySymbolField = screen.getByRole("textbox", {
      name: "currencySymbol",
    });
    expect(currencySymbolField).toBeInTheDocument();
    expect(currencySymbolField).toBeEnabled();
    expect(currencySymbolField).toHaveValue("");
    expect(currencySymbolField).toHaveAttribute("placeholder", "ZND");
    expect(screen.getByText("Currency symbol")).toBeInTheDocument();

    expect(screen.getByText("Decimals")).toBeInTheDocument();
    const decimalsField = screen.getByRole("spinbutton", {
      name: "currencyDecimals",
    });
    expect(decimalsField).toBeInTheDocument();
    expect(decimalsField).toBeEnabled();
    expect(decimalsField).toHaveValue(null);
    expect(decimalsField).toHaveAttribute("placeholder", "18");
    expect(screen.getByText("Currency decimals")).toBeInTheDocument();

    const addChainButton = screen.getByRole("button", {
      name: "Add/edit chain",
    });
    expect(addChainButton).toBeInTheDocument();
    expect(addChainButton).toBeDisabled();
  });

  it("should render the edit chain form component", async () => {
    renderComponent(
      mockedStore({
        zondStore: { refreshBlockchainData: jest.fn(async () => {}) },
      }),
      {
        chainToEdit: {
          chainId: "0x5",
          chainName: "Test chain name",
          rpcUrls: [],
          blockExplorerUrls: [],
          iconUrls: [],
          nativeCurrency: {
            name: "Test native currency",
            symbol: "Test symbol",
            decimals: 18,
          },
          defaultRpcUrl: "http://testDefaultRpcUrl",
          defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
          defaultIconUrl: "http://testDefaultIconUrl",
          isTestnet: false,
          defaultWsRpcUrl: "http://testDefaultRpcUrl",
          isCustomChain: true,
        },
      },
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Edit chain" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Chain name")).toBeInTheDocument();
    const chainNameField = screen.getByRole("textbox", { name: "chainName" });
    expect(chainNameField).toBeInTheDocument();
    expect(chainNameField).toBeEnabled();
    expect(chainNameField).toHaveValue("Test chain name");
    expect(chainNameField).toHaveAttribute("placeholder", "Zond customnet");
    expect(screen.getByText("Blockchain name")).toBeInTheDocument();

    expect(screen.getByText("Chain ID")).toBeInTheDocument();
    const chainIdField = screen.getByRole("spinbutton", { name: "chainId" });
    expect(chainIdField).toBeInTheDocument();
    expect(chainIdField).toBeDisabled();
    expect(chainIdField).toHaveValue(5);
    expect(chainIdField).toHaveAttribute("placeholder", "111");
    expect(screen.getByText("Unique chain ID")).toBeInTheDocument();

    expect(screen.getAllByText("Mocked Url Selections")).toHaveLength(3);

    expect(screen.getByText("Currency name")).toBeInTheDocument();
    const currencyName = screen.getByRole("textbox", { name: "currencyName" });
    expect(currencyName).toBeInTheDocument();
    expect(currencyName).toBeEnabled();
    expect(currencyName).toHaveValue("Test native currency");
    expect(currencyName).toHaveAttribute("placeholder", "ZND");
    expect(screen.getByText("Currency of this blockchain")).toBeInTheDocument();

    expect(screen.getByText("Symbol")).toBeInTheDocument();
    const currencySymbolField = screen.getByRole("textbox", {
      name: "currencySymbol",
    });
    expect(currencySymbolField).toBeInTheDocument();
    expect(currencySymbolField).toBeEnabled();
    expect(currencySymbolField).toHaveValue("Test symbol");
    expect(currencySymbolField).toHaveAttribute("placeholder", "ZND");
    expect(screen.getByText("Currency symbol")).toBeInTheDocument();

    expect(screen.getByText("Decimals")).toBeInTheDocument();
    const decimalsField = screen.getByRole("spinbutton", {
      name: "currencyDecimals",
    });
    expect(decimalsField).toBeInTheDocument();
    expect(decimalsField).toBeEnabled();
    expect(decimalsField).toHaveValue(18);
    expect(decimalsField).toHaveAttribute("placeholder", "18");
    expect(screen.getByText("Currency decimals")).toBeInTheDocument();

    const editChainButton = screen.getByRole("button", {
      name: "Add/edit chain",
    });
    expect(editChainButton).toBeInTheDocument();
    await waitFor(async () => {
      expect(editChainButton).toBeEnabled();
    });
  });

  it("should add a chain to the chainlist on clicking add chain button", async () => {
    const mockChains = [
      {
        chainId: "0x5",
        chainName: "Test chain name",
        rpcUrls: ["http://testDefaultRpcUrl"],
        blockExplorerUrls: ["http://testDefaultExplorerUrl"],
        iconUrls: ["http://testDefaultIconUrl"],
        nativeCurrency: {
          name: "Test native currency",
          symbol: "Test symbol",
          decimals: 18,
        },
        defaultRpcUrl: "http://testDefaultRpcUrl",
        defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
        defaultIconUrl: "http://testDefaultIconUrl",
        isTestnet: false,
        defaultWsRpcUrl: "http://testDefaultRpcUrl",
        isCustomChain: true,
      },
    ];
    (
      StorageUtil.getAllBlockChains as jest.MockedFunction<
        typeof StorageUtil.getAllBlockChains
      >
    ).mockResolvedValue(mockChains);
    (
      StorageUtil.setAllBlockChains as jest.MockedFunction<
        typeof StorageUtil.setAllBlockChains
      >
    ).mockResolvedValue();
    renderComponent();

    const chainNameField = screen.getByRole("textbox", { name: "chainName" });
    await userEvent.type(chainNameField, "Typed chain name");
    const chainIdField = screen.getByRole("spinbutton", { name: "chainId" });
    await userEvent.type(chainIdField, "243");
    const currencyName = screen.getByRole("textbox", { name: "currencyName" });
    await userEvent.type(currencyName, "Typed currency name");
    const currencySymbolField = screen.getByRole("textbox", {
      name: "currencySymbol",
    });
    await userEvent.type(currencySymbolField, "TPD");
    const decimalsField = screen.getByRole("spinbutton", {
      name: "currencyDecimals",
    });
    await userEvent.type(decimalsField, "18");
    const addChainButton = screen.getByRole("button", {
      name: "Add/edit chain",
    });
    expect(addChainButton).toBeInTheDocument();
    expect(addChainButton).toBeEnabled();
    await userEvent.click(addChainButton);
    const expectedChainArray: BlockchainDataType[] = [
      {
        chainId: "0x5",
        chainName: "Test chain name",
        rpcUrls: ["http://testDefaultRpcUrl"],
        blockExplorerUrls: ["http://testDefaultExplorerUrl"],
        iconUrls: ["http://testDefaultIconUrl"],
        nativeCurrency: {
          name: "Test native currency",
          symbol: "Test symbol",
          decimals: 18,
        },
        defaultRpcUrl: "http://testDefaultRpcUrl",
        defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
        defaultIconUrl: "http://testDefaultIconUrl",
        isTestnet: false,
        defaultWsRpcUrl: "http://testDefaultRpcUrl",
        isCustomChain: true,
      },
      {
        chainId: "0xf3",
        chainName: "Typed chain name",
        rpcUrls: [],
        blockExplorerUrls: [],
        iconUrls: [],
        nativeCurrency: {
          name: "Typed currency name",
          symbol: "TPD",
          decimals: 18,
        },
        defaultRpcUrl: "",
        defaultBlockExplorerUrl: "",
        defaultIconUrl: "",
        isTestnet: false,
        defaultWsRpcUrl: "http://127.0.0.1:8545",
        isCustomChain: true,
      },
    ];
    expect(StorageUtil.setAllBlockChains).toHaveBeenCalledTimes(1);
    expect(StorageUtil.setAllBlockChains).toHaveBeenCalledWith(
      expectedChainArray,
    );
  });

  it("should edit the chain and update the chainlist on clicking edit chain button", async () => {
    const mockChains = [
      {
        chainId: "0x5",
        chainName: "Test chain name",
        rpcUrls: ["http://testDefaultRpcUrl"],
        blockExplorerUrls: ["http://testDefaultExplorerUrl"],
        iconUrls: ["http://testDefaultIconUrl"],
        nativeCurrency: {
          name: "Test native currency",
          symbol: "Test symbol",
          decimals: 18,
        },
        defaultRpcUrl: "http://testDefaultRpcUrl",
        defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
        defaultIconUrl: "http://testDefaultIconUrl",
        isTestnet: false,
        defaultWsRpcUrl: "http://testDefaultRpcUrl",
        isCustomChain: true,
      },
    ];
    (
      StorageUtil.getAllBlockChains as jest.MockedFunction<
        typeof StorageUtil.getAllBlockChains
      >
    ).mockResolvedValue(mockChains);
    (
      StorageUtil.setAllBlockChains as jest.MockedFunction<
        typeof StorageUtil.setAllBlockChains
      >
    ).mockResolvedValue();
    renderComponent(
      mockedStore({
        zondStore: { refreshBlockchainData: jest.fn(async () => {}) },
      }),
      {
        chainToEdit: {
          chainId: "0x5",
          chainName: "Test chain name",
          rpcUrls: ["http://testDefaultRpcUrl"],
          blockExplorerUrls: ["http://testDefaultExplorerUrl"],
          iconUrls: ["http://testDefaultIconUrl"],
          nativeCurrency: {
            name: "Test native currency",
            symbol: "Test symbol",
            decimals: 18,
          },
          defaultRpcUrl: "http://testDefaultRpcUrl",
          defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
          defaultIconUrl: "http://testDefaultIconUrl",
          isTestnet: false,
          defaultWsRpcUrl: "http://testDefaultRpcUrl",
          isCustomChain: true,
        },
      },
    );

    const chainNameField = screen.getByRole("textbox", { name: "chainName" });
    await userEvent.type(chainNameField, " edited");
    const chainIdField = screen.getByRole("spinbutton", { name: "chainId" });
    await userEvent.type(chainIdField, "1");
    const currencyName = screen.getByRole("textbox", {
      name: "currencyName",
    });
    await userEvent.type(currencyName, " edited");
    const currencySymbolField = screen.getByRole("textbox", {
      name: "currencySymbol",
    });
    await userEvent.type(currencySymbolField, " edited");
    const decimalsField = screen.getByRole("spinbutton", {
      name: "currencyDecimals",
    });
    await userEvent.clear(decimalsField);
    await userEvent.type(decimalsField, "16");
    const editChainButton = screen.getByRole("button", {
      name: "Add/edit chain",
    });
    expect(editChainButton).toBeInTheDocument();
    expect(editChainButton).toBeEnabled();
    await userEvent.click(editChainButton);
    const expectedChainArray: BlockchainDataType[] = [
      {
        chainId: "0x5",
        chainName: "Test chain name edited",
        rpcUrls: ["http://testDefaultRpcUrl"],
        blockExplorerUrls: ["http://testDefaultExplorerUrl"],
        iconUrls: ["http://testDefaultIconUrl"],
        nativeCurrency: {
          name: "Test native currency edited",
          symbol: "Test symbol edited",
          decimals: 16,
        },
        defaultRpcUrl: "http://testDefaultRpcUrl",
        defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
        defaultIconUrl: "http://testDefaultIconUrl",
        isTestnet: false,
        defaultWsRpcUrl: "http://testDefaultRpcUrl",
        isCustomChain: true,
      },
    ];
    expect(StorageUtil.setAllBlockChains).toHaveBeenCalledTimes(1);
    expect(StorageUtil.setAllBlockChains).toHaveBeenCalledWith(
      expectedChainArray,
    );
  });
});
