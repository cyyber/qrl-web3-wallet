import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ActiveBrowserTab from "../ActiveBrowserTab";
import userEvent from "@testing-library/user-event";

describe("ActiveBrowserTab", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ActiveBrowserTab />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the active browser tab", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: true,
          currentTabData: {
            title: "Test Title",
            favIconUrl: "http://testIconUrl",
            urlOrigin: "Test URL origin",
          },
        },
      }),
    );

    expect(screen.getByText("Active browser tab")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://testIconUrl");
    expect(img).toHaveAttribute("alt", "Test Title");
    expect(screen.getByText("Test URL origin")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    const disconnectButton = screen.getByRole("button", { name: "Disconnect" });
    expect(disconnectButton).toBeInTheDocument();
  });

  it("should not render the disconnect button if not connected", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: false,
        },
      }),
    );

    const disconnectButton = screen.queryByRole("button", {
      name: "Disconnect",
    });
    expect(disconnectButton).not.toBeInTheDocument();
  });

  it("should call the disconnectFromCurrentTab function on clicking the disconnect button", async () => {
    const mockedDisconnectFromCurrentTab = jest.fn(async () => {});
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: true,
          disconnectFromCurrentTab: mockedDisconnectFromCurrentTab,
        },
      }),
    );

    const disconnectButton = screen.getByRole("button", { name: "Disconnect" });
    expect(disconnectButton).toBeInTheDocument();
    await userEvent.click(disconnectButton);
    expect(mockedDisconnectFromCurrentTab).toHaveBeenCalledTimes(1);
  });
});
