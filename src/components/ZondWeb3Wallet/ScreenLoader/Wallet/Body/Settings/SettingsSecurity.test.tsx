import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SettingsSecurity from "./SettingsSecurity";

beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn(() => false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

describe("SettingsSecurity", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <SettingsSecurity />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the Security & Privacy heading", () => {
    renderComponent();

    expect(screen.getByText("Security & Privacy")).toBeInTheDocument();
  });

  it("should render the auto-lock select trigger", () => {
    renderComponent();

    expect(
      screen.getByRole("combobox", { name: "Auto-lock timeout" }),
    ).toBeInTheDocument();
  });

  it("should call setAutoLockMinutes when selecting an option", async () => {
    const setAutoLockMinutes = jest.fn<any>(() => Promise.resolve());
    renderComponent(mockedStore({ settingsStore: { setAutoLockMinutes } }));

    await userEvent.click(
      screen.getByRole("combobox", { name: "Auto-lock timeout" }),
    );
    await userEvent.click(screen.getByRole("option", { name: "5 minutes" }));

    expect(setAutoLockMinutes).toHaveBeenCalledWith(5);
  });

  it("should call setAutoLockMinutes with 0 for Never", async () => {
    const setAutoLockMinutes = jest.fn<any>(() => Promise.resolve());
    renderComponent(mockedStore({ settingsStore: { setAutoLockMinutes } }));

    await userEvent.click(
      screen.getByRole("combobox", { name: "Auto-lock timeout" }),
    );
    await userEvent.click(screen.getByRole("option", { name: "Never" }));

    expect(setAutoLockMinutes).toHaveBeenCalledWith(0);
  });

  it("should render the show balance and price checkbox", () => {
    renderComponent();

    expect(
      screen.getByLabelText("Show balance and token price"),
    ).toBeInTheDocument();
  });

  it("should render CoinGecko privacy notice", () => {
    renderComponent();

    expect(screen.getByText(/CoinGecko API/)).toBeInTheDocument();
  });

  it("should call setShowBalanceAndPrice when toggling checkbox", async () => {
    const setShowBalanceAndPrice = jest.fn<any>(() => Promise.resolve());
    const fetchPrices = jest.fn<any>(() => Promise.resolve());
    const startAutoRefresh = jest.fn<any>();
    renderComponent(
      mockedStore({
        settingsStore: { showBalanceAndPrice: true, setShowBalanceAndPrice },
        priceStore: { fetchPrices, startAutoRefresh },
      }),
    );

    // Click to uncheck (currently checked because showBalanceAndPrice: true)
    await userEvent.click(
      screen.getByLabelText("Show balance and token price"),
    );

    expect(setShowBalanceAndPrice).toHaveBeenCalledWith(false);
  });

  it("should start auto-refresh when enabling balance display", async () => {
    const setShowBalanceAndPrice = jest.fn<any>(() => Promise.resolve());
    const fetchPrices = jest.fn<any>(() => Promise.resolve());
    const startAutoRefresh = jest.fn<any>();
    renderComponent(
      mockedStore({
        settingsStore: { showBalanceAndPrice: false, setShowBalanceAndPrice },
        priceStore: { fetchPrices, startAutoRefresh },
      }),
    );

    // Click to check (currently unchecked because showBalanceAndPrice: false)
    await userEvent.click(
      screen.getByLabelText("Show balance and token price"),
    );

    expect(setShowBalanceAndPrice).toHaveBeenCalledWith(true);
    expect(fetchPrices).toHaveBeenCalled();
    expect(startAutoRefresh).toHaveBeenCalled();
  });

  it("should stop auto-refresh when disabling balance display", async () => {
    const setShowBalanceAndPrice = jest.fn<any>(() => Promise.resolve());
    const stopAutoRefresh = jest.fn<any>();
    renderComponent(
      mockedStore({
        settingsStore: { showBalanceAndPrice: true, setShowBalanceAndPrice },
        priceStore: { stopAutoRefresh },
      }),
    );

    await userEvent.click(
      screen.getByLabelText("Show balance and token price"),
    );

    expect(setShowBalanceAndPrice).toHaveBeenCalledWith(false);
    expect(stopAutoRefresh).toHaveBeenCalled();
  });
});
