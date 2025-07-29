import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppRequest from "../DAppRequest";
import { TooltipProvider } from "@/components/UI/Tooltip";

jest.mock(
  "@/components/ZondWeb3Wallet/DAppRequest/DAppRequestContent/DAppRequestConnectionNotAvailable/DAppRequestConnectionNotAvailable",
  () => () => <div>Mocked DApp Request Connection Not Available</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/DAppRequest/DAppRequestContent/DAppRequestCompleted/DAppRequestCompleted",
  () => () => <div>Mocked DApp Request Completed</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/Header/ChainBadge/ChainBadge",
  () => () => <div>Mocked ChainBadge</div>,
);

describe("DAppRequest", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <DAppRequest />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should display network not available if there is no connection", async () => {
    renderComponent(
      mockedStore({
        zondStore: { zondConnection: { isConnected: false } },
      }),
    );

    expect(
      screen.getByText("Mocked DApp Request Connection Not Available"),
    ).toBeInTheDocument();
  });

  it("should display dapp request completed component if the request has completed", async () => {
    renderComponent(
      mockedStore({
        zondStore: { zondConnection: { isConnected: true } },
        dAppRequestStore: { approvalProcessingStatus: { hasCompleted: true } },
      }),
    );

    expect(
      screen.getByText("Mocked DApp Request Completed"),
    ).toBeInTheDocument();
  });

  it("should render the dapp request content component", async () => {
    renderComponent();

    expect(screen.getByText("Mocked ChainBadge")).toBeInTheDocument();
    expect(screen.getByText("Your permission required")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here is a request coming in. Go through the details and decide if it needs to be allowed.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Do you trust and want to allow this?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "No" });
    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(noButton).toBeInTheDocument();
    expect(yesButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    expect(yesButton).toBeDisabled();
  });
});
