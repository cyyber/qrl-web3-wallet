import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { TooltipProvider } from "@/components/UI/Tooltip";

jest.mock(
  "@/components/ZondWeb3Wallet/Header/ZondWeb3WalletLogo/ZondWeb3WalletLogo",
  () => () => <div>Mocked Zond Web3 Wallet Logo</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/Header/AccountBadge/AccountBadge",
  () => () => <div>Mocked Account Badge</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/Header/ChainBadge/ChainBadge",
  () => () => <div>Mocked Chain Badge</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/Header/DAppBadge/DAppBadge",
  () => () => <div>Mocked DApp Badge</div>,
);

describe("Header", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <Header />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the zond web3 wallet logo component and the chain badge component", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Mocked Zond Web3 Wallet Logo"),
      ).toBeInTheDocument();
      expect(screen.getByText("Mocked Account Badge")).toBeInTheDocument();
      expect(screen.getByText("Mocked Chain Badge")).toBeInTheDocument();
      expect(screen.getByText("Mocked DApp Badge")).toBeInTheDocument();
    });
  });

  it("should not render the account badge and dapp badge if the connection status is false", async () => {
    const mockedStoreValues = mockedStore({
      zondStore: { zondConnection: { isConnected: false } },
    });
    renderComponent(mockedStoreValues);

    await waitFor(() => {
      expect(
        screen.getByText("Mocked Zond Web3 Wallet Logo"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Mocked Account Badge"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Mocked DApp Badge")).not.toBeInTheDocument();
      expect(screen.getByText("Mocked Chain Badge")).toBeInTheDocument();
    });
  });
});
