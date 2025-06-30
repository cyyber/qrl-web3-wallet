import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZondWeb3WalletLogo from "../ZondWeb3WalletLogo";

describe("ZondWeb3WalletLogo", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ZondWeb3WalletLogo />
      </MemoryRouter>,
    );

  it("should render the zond web3 wallet logo in the component", () => {
    renderComponent();

    const img = screen.getByAltText("Zond Web3 Wallet Logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "icons/qrl/default.png");
    expect(img).toHaveClass("h-6", "w-6");
  });
});
