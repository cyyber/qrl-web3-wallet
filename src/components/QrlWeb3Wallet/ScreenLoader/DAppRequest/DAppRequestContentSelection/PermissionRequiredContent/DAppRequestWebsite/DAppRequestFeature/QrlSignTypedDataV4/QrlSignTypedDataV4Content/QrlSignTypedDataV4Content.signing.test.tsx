import compatibility from "@/__fixtures__/qrlCompatibility.json";
import typedDataFixture from "@/__fixtures__/qrlTypedData.json";
import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { StoreProvider } from "@/stores/store";
import { MLDSA87, newMLDSA87Descriptor } from "@theqrl/wallet.js";
import { seedToAccount } from "@theqrl/web3-qrl-accounts";
import { hexToBytes } from "@theqrl/web3-utils";
import { cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import QrlSignTypedDataV4Content from "./QrlSignTypedDataV4Content";

vi.mock("@/scripts/utils/restrictedMethodsMiddlewareUtils", () => ({
  revalidateAuthorizedDAppRequest: vi.fn(async () => ({
    canProceed: true,
    proceedError: undefined,
  })),
}));

// jsdom's TextEncoder returns a Uint8Array of another realm, which web3's
// validator does not recognise as bytes. A browser has a single realm.
class SameRealmTextEncoder {
  encode(text: string) {
    return Uint8Array.from(Buffer.from(text, "utf8"));
  }
}

// The approval path with the real libraries: the screen must sign the digest
// go-qrl computes for the same payload, and nothing else.
describe("QrlSignTypedDataV4Content signing", () => {
  beforeEach(() => {
    vi.stubGlobal("TextEncoder", SameRealmTextEncoder);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const signer = compatibility.wallets[0];
  const seed = `0x${signer.extendedSeed}`;
  const { typedData, hash } = typedDataFixture.vectors[0];

  const renderForApproval = (requestTypedData: unknown) => {
    const addToResponseData = vi.fn();
    let approve: ((hasApproved: boolean) => Promise<void>) | undefined;
    render(
      <StoreProvider
        value={mockedStore({
          qrlStore: { qrlInstance: { accounts: { seedToAccount } } },
          lockStore: { getAccountSeed: async () => seed },
          dAppRequestStore: {
            dAppRequestData: { params: [signer.address, requestTypedData] },
            addToResponseData,
            setOnPermissionCallBack: (
              callBack: (hasApproved: boolean) => Promise<void>,
            ) => {
              approve = callBack;
            },
          },
        })}
      >
        <MemoryRouter>
          <TooltipProvider>
            <QrlSignTypedDataV4Content />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );
    return {
      addToResponseData,
      decide: async (hasApproved: boolean) => {
        await waitFor(() => {
          expect(approve).toBeDefined();
        });
        await approve?.(hasApproved);
      },
    };
  };

  it("answers an approved request with a signature over go-qrl's digest", async () => {
    const { addToResponseData, decide } = renderForApproval(typedData);
    await decide(true);

    expect(addToResponseData).toHaveBeenCalledTimes(1);
    const response = addToResponseData.mock.calls[0][0];
    expect(response.error).toBeUndefined();
    expect(
      MLDSA87.verify(
        hexToBytes(response.signature),
        hexToBytes(hash),
        hexToBytes(response.publicKey),
        newMLDSA87Descriptor(),
      ),
    ).toBe(true);
  });

  it("answers with an error, not a signature, for an Ethereum EIP712Domain payload", async () => {
    const { QRLTypedDataDomain, ...otherTypes } = typedData.types;
    const { addToResponseData, decide } = renderForApproval({
      ...typedData,
      types: { ...otherTypes, EIP712Domain: QRLTypedDataDomain },
    });
    await decide(true);

    expect(addToResponseData).toHaveBeenCalledTimes(1);
    const response = addToResponseData.mock.calls[0][0];
    expect(response.signature).toBeUndefined();
    expect(String(response.error)).toContain("QRLTypedDataDomain");
  });

  it("signs nothing when the request is rejected", async () => {
    const { addToResponseData, decide } = renderForApproval(typedData);
    await decide(false);

    expect(addToResponseData).not.toHaveBeenCalled();
  });
});
