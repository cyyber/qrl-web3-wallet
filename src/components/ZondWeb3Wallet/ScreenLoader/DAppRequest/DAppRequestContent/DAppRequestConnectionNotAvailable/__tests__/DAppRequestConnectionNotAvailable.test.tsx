import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppRequestConnectionNotAvailable from "../DAppRequestConnectionNotAvailable";
import userEvent from "@testing-library/user-event";

describe("DAppRequestConnectionNotAvailable", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <DAppRequestConnectionNotAvailable />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp request connection not available component for rejcted request", async () => {
    window.close = jest.fn();
    const mockedOnPermission = jest.fn(async (hasApproved: boolean) => {
      hasApproved;
    });
    renderComponent(
      mockedStore({ dAppRequestStore: { onPermission: mockedOnPermission } }),
    );

    expect(screen.getByText("Connection not available!")).toBeInTheDocument();
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toBeEnabled();
    await userEvent.click(closeButton);
    expect(mockedOnPermission).toHaveBeenCalledTimes(1);
  });
});
