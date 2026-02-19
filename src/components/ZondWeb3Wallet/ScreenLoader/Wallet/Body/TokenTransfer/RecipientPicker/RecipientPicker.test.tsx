import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RecipientPicker from "./RecipientPicker";

const localStore: Record<string, any> = {};
jest.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    storage: {
      local: {
        get: jest.fn((key: string) =>
          Promise.resolve(key in localStore ? { [key]: localStore[key] } : {}),
        ),
        set: jest.fn((data: Record<string, any>) => {
          Object.assign(localStore, data);
          return Promise.resolve();
        }),
        remove: jest.fn((key: string) => {
          delete localStore[key];
          return Promise.resolve();
        }),
        clear: jest.fn(() => {
          for (const k of Object.keys(localStore)) delete localStore[k];
          return Promise.resolve();
        }),
      },
      session: {
        get: jest.fn(() => Promise.resolve({})),
        set: jest.fn(() => Promise.resolve()),
      },
    },
  },
}));

describe("RecipientPicker", () => {
  beforeEach(() => {
    for (const k of Object.keys(localStore)) delete localStore[k];
  });
  afterEach(cleanup);

  const renderComponent = (
    onSelect = jest.fn<any>(),
    mockedStoreValues = mockedStore(),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <RecipientPicker
            open={true}
            onOpenChange={jest.fn()}
            onSelect={onSelect}
          />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dialog title", () => {
    renderComponent();

    expect(screen.getByText("Select Recipient")).toBeInTheDocument();
  });

  it("should render three tabs", () => {
    renderComponent();

    expect(screen.getByText("My Accounts")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("Recent")).toBeInTheDocument();
  });

  it("should show 'No other accounts' when only active account exists", () => {
    renderComponent();

    expect(screen.getByText("No other accounts")).toBeInTheDocument();
  });

  it("should list other accounts excluding active", async () => {
    renderComponent(
      jest.fn(),
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
          },
          zondAccounts: {
            accounts: [
              {
                accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
                accountBalance: "10",
              },
              {
                accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "5",
              },
            ],
          },
        },
      }),
    );

    // Labels load async from storage
    await waitFor(() => {
      expect(screen.getByText("Account 2")).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Q20fB08fF1f1376A14C055E9F56df80563E16722b/),
    ).toBeInTheDocument();
  });

  it("should label Ledger accounts as 'Ledger' with index", async () => {
    renderComponent(
      jest.fn(),
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
          },
          zondAccounts: {
            accounts: [
              {
                accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
                accountBalance: "10",
              },
              {
                accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "5",
              },
              {
                accountAddress: "Q30aA00aA0a0000A00A000A0A00aa00000A00000c",
                accountBalance: "3",
              },
            ],
          },
        },
        ledgerStore: {
          isLedgerAccount: (addr: string) =>
            addr === "Q30aA00aA0a0000A00A000A0A00aa00000A00000c",
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Account 2")).toBeInTheDocument();
    });
    expect(screen.getByText("Ledger 1")).toBeInTheDocument();
  });

  it("should persist labels and reuse them on next open", async () => {
    // First render — auto-generates labels
    const store1 = mockedStore({
      zondStore: {
        activeAccount: {
          accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
        },
        zondAccounts: {
          accounts: [
            {
              accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
              accountBalance: "10",
            },
            {
              accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
              accountBalance: "5",
            },
          ],
        },
      },
    });

    const { unmount } = render(
      <StoreProvider value={store1}>
        <MemoryRouter>
          <RecipientPicker
            open={true}
            onOpenChange={jest.fn()}
            onSelect={jest.fn()}
          />
        </MemoryRouter>
      </StoreProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Account 2")).toBeInTheDocument();
    });
    unmount();

    // Verify labels were persisted in storage
    expect(localStore["ACCOUNT_LABELS"]).toBeDefined();
    expect(
      localStore["ACCOUNT_LABELS"]["Q20B714091cF2a62DADda2847803e3f1B9D2D3779"],
    ).toBe("Account 1");
    expect(
      localStore["ACCOUNT_LABELS"]["Q20fB08fF1f1376A14C055E9F56df80563E16722b"],
    ).toBe("Account 2");
  });

  it("should avoid label collisions when accounts are removed and re-added", async () => {
    // Pre-seed storage: Account 1 was removed, but "Account 2" label remains
    localStore["ACCOUNT_LABELS"] = {
      Q20fB08fF1f1376A14C055E9F56df80563E16722b: "Account 2",
    };

    renderComponent(
      jest.fn(),
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
          },
          zondAccounts: {
            accounts: [
              {
                accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "5",
              },
              {
                // New account — should get "Account 1" (not "Account 2" which is taken)
                accountAddress: "Q30aA00aA0a0000A00A000A0A00aa00000A00000c",
                accountBalance: "3",
              },
            ],
          },
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Account 1")).toBeInTheDocument();
    });
    // "Account 2" is the active account (filtered out), so only "Account 1" shows
    expect(screen.queryByText("Account 2")).not.toBeInTheDocument();

    // Verify in storage: new account got "Account 1", not a duplicate "Account 2"
    expect(
      localStore["ACCOUNT_LABELS"]["Q30aA00aA0a0000A00A000A0A00aa00000A00000c"],
    ).toBe("Account 1");
  });

  it("should show 'No contacts saved' on contacts tab", async () => {
    renderComponent();

    await userEvent.click(screen.getByText("Contacts"));

    expect(screen.getByText("No contacts saved")).toBeInTheDocument();
  });

  it("should show contacts on contacts tab", async () => {
    renderComponent(
      jest.fn(),
      mockedStore({
        contactsStore: {
          contacts: [
            {
              name: "Alice",
              address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
            },
          ],
        },
      }),
    );

    await userEvent.click(screen.getByText("Contacts"));

    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("should show 'No recent transactions' on recent tab", async () => {
    renderComponent();

    await userEvent.click(screen.getByText("Recent"));

    expect(screen.getByText("No recent transactions")).toBeInTheDocument();
  });

  it("should show recent addresses on recent tab", async () => {
    renderComponent(
      jest.fn(),
      mockedStore({
        transactionHistoryStore: {
          transactions: [
            {
              id: "0x1",
              from: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
              to: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
              amount: 1,
              tokenSymbol: "QRL",
              tokenName: "Zond",
              isZrc20Token: false,
              tokenContractAddress: "",
              tokenDecimals: 18,
              transactionHash: "0x1",
              blockNumber: "1",
              gasUsed: "21000",
              effectiveGasPrice: "1000000000",
              status: true,
              timestamp: Date.now(),
              chainId: "0x1",
            },
          ],
        },
      }),
    );

    await userEvent.click(screen.getByText("Recent"));

    expect(
      screen.getByText(/Q20fB08fF1f1376A14C055E9F56df80563E16722b/),
    ).toBeInTheDocument();
  });

  it("should call onSelect when an address is clicked", async () => {
    const onSelect = jest.fn<any>();
    renderComponent(
      onSelect,
      mockedStore({
        zondStore: {
          activeAccount: {
            accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
          },
          zondAccounts: {
            accounts: [
              {
                accountAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
                accountBalance: "10",
              },
              {
                accountAddress: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
                accountBalance: "5",
              },
            ],
          },
        },
      }),
    );

    // Wait for labels to load
    await waitFor(() => {
      expect(screen.getByText("Account 2")).toBeInTheDocument();
    });

    const addressButton = screen.getByText(
      /Q20fB08fF1f1376A14C055E9F56df80563E16722b/,
    );
    await userEvent.click(addressButton.closest("button")!);

    expect(onSelect).toHaveBeenCalledWith(
      "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
    );
  });

  it("should call onSelect when a contact is clicked", async () => {
    const onSelect = jest.fn<any>();
    renderComponent(
      onSelect,
      mockedStore({
        contactsStore: {
          contacts: [
            {
              name: "Alice",
              address: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
            },
          ],
        },
      }),
    );

    await userEvent.click(screen.getByText("Contacts"));
    const contactButton = screen.getByText("Alice").closest("button")!;
    await userEvent.click(contactButton);

    expect(onSelect).toHaveBeenCalledWith(
      "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
    );
  });

  it("should call onSelect when a recent address is clicked", async () => {
    const onSelect = jest.fn<any>();
    renderComponent(
      onSelect,
      mockedStore({
        transactionHistoryStore: {
          transactions: [
            {
              id: "0x1",
              from: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
              to: "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
              amount: 1,
              tokenSymbol: "QRL",
              tokenName: "Zond",
              isZrc20Token: false,
              tokenContractAddress: "",
              tokenDecimals: 18,
              transactionHash: "0x1",
              blockNumber: "1",
              gasUsed: "21000",
              effectiveGasPrice: "1000000000",
              status: true,
              timestamp: Date.now(),
              chainId: "0x1",
            },
          ],
        },
      }),
    );

    await userEvent.click(screen.getByText("Recent"));
    const recentButton = screen
      .getByText(/Q20fB08fF1f1376A14C055E9F56df80563E16722b/)
      .closest("button")!;
    await userEvent.click(recentButton);

    expect(onSelect).toHaveBeenCalledWith(
      "Q20fB08fF1f1376A14C055E9F56df80563E16722b",
    );
  });

  it("should render address book trigger button", () => {
    render(
      <StoreProvider value={mockedStore()}>
        <MemoryRouter>
          <RecipientPicker
            open={false}
            onOpenChange={jest.fn()}
            onSelect={jest.fn()}
          />
        </MemoryRouter>
      </StoreProvider>,
    );

    expect(screen.getByLabelText("Open address book")).toBeInTheDocument();
  });
});
