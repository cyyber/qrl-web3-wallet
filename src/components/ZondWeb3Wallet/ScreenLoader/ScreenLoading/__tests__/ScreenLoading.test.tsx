import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScreenLoading from "../ScreenLoading";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Shared/CircuitBackground/CircuitBackground",
  () => () => <div>Mocked Circuit Background</div>,
);

describe("ScreenLoading", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ScreenLoading />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the wallet component", () => {
    renderComponent();

    expect(screen.getByText("Mocked Circuit Background")).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });
});
