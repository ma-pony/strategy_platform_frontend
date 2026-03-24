import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Gated from "@/components/paywall/Gated";
import { useAuthStore } from "@/stores/authStore";

describe("Gated", () => {
  it("renders children when allowed", () => {
    useAuthStore.getState().setPlan("member");
    render(
      <MemoryRouter>
        <Gated require="can_download_strategy" reason="download_strategy" deniedMode="BLUR">
          <div>OK</div>
        </Gated>
      </MemoryRouter>,
    );
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders fallback when denied", () => {
    useAuthStore.getState().setPlan("guest");
    render(
      <MemoryRouter>
        <Gated require="can_download_strategy" reason="download_strategy" deniedMode="BLUR" fallback={<div>LOCKED</div>}>
          <div>OK</div>
        </Gated>
      </MemoryRouter>,
    );
    expect(screen.getByText("LOCKED")).toBeInTheDocument();
  });
});
