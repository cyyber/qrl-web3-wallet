import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import ActiveAccount from "./ActiveAccount";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/AccountList/AccountId/AccountId",
  () => () => <div>Mocked Account Id</div>,
);

describe("ActiveAccount", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ActiveAccount />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  const openMenu = async () => {
    const trigger = screen.getByTestId("account-menu");
    await userEvent.click(trigger);
  };

  it("should render the active account component", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
      }),
    );

    expect(screen.getByText("Active account")).toBeInTheDocument();
    expect(screen.getByText("Mocked Account Id")).toBeInTheDocument();

    await openMenu();
    expect(
      screen.getByRole("menuitem", { name: "Send Quanta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Copy Address" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Rename" }),
    ).toBeInTheDocument();
  });

  it("should call the copyAccount function on clicking the copy button", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
      }),
    );

    const mockedWriteText = jest.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockedWriteText,
      },
      writable: true,
    });

    await openMenu();
    const copyItem = screen.getByRole("menuitem", { name: "Copy Address" });
    await userEvent.click(copyItem);
    expect(mockedWriteText).toBeCalledTimes(1);
    expect(mockedWriteText).toBeCalledWith(
      "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
    );
  });

  it("should show edit input when rename is clicked", async () => {
    const labels: Record<string, string> = {
      Q20fB08fF1f1376A14C055E9F56df80563E16722b: "My Main Wallet",
    };
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
        accountLabelsStore: {
          labels,
          getLabel: (addr: string) => labels[addr] ?? "",
        },
      }),
    );

    await openMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Rename" }),
    );

    const input = screen.getByRole("textbox", { name: "Edit account label" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("My Main Wallet");
    expect(
      screen.getByRole("button", { name: "Save label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel edit" }),
    ).toBeInTheDocument();
  });

  it("should call setLabel on save", async () => {
    const setLabel = jest.fn<any>(() => Promise.resolve());
    const labels: Record<string, string> = {
      Q20fB08fF1f1376A14C055E9F56df80563E16722b: "Old Name",
    };
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
        accountLabelsStore: {
          labels,
          getLabel: (addr: string) => labels[addr] ?? "",
          setLabel,
        },
      }),
    );

    await openMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Rename" }),
    );

    const input = screen.getByRole("textbox", { name: "Edit account label" });
    await userEvent.clear(input);
    await userEvent.type(input, "New Name");

    await userEvent.click(
      screen.getByRole("button", { name: "Save label" }),
    );

    expect(setLabel).toHaveBeenCalledWith(
      "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
      "New Name",
    );
  });

  it("should hide edit input on cancel", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
      }),
    );

    await openMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Rename" }),
    );
    expect(
      screen.getByRole("textbox", { name: "Edit account label" }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Cancel edit" }),
    );

    expect(
      screen.queryByRole("textbox", { name: "Edit account label" }),
    ).not.toBeInTheDocument();
  });

  it("should save on Enter key", async () => {
    const setLabel = jest.fn<any>(() => Promise.resolve());
    const labels: Record<string, string> = {
      Q20fB08fF1f1376A14C055E9F56df80563E16722b: "Old Name",
    };
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
        accountLabelsStore: {
          labels,
          getLabel: (addr: string) => labels[addr] ?? "",
          setLabel,
        },
      }),
    );

    await openMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Rename" }),
    );

    const input = screen.getByRole("textbox", { name: "Edit account label" });
    await userEvent.clear(input);
    await userEvent.type(input, "Enter Name{Enter}");

    await waitFor(() => {
      expect(setLabel).toHaveBeenCalledWith(
        "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
        "Enter Name",
      );
    });
  });

  it("should cancel on Escape key", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
        },
      }),
    );

    await openMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Rename" }),
    );

    const input = screen.getByRole("textbox", { name: "Edit account label" });
    await userEvent.type(input, "{Escape}");

    expect(
      screen.queryByRole("textbox", { name: "Edit account label" }),
    ).not.toBeInTheDocument();
  });
});
