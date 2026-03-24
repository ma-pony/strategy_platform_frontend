import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Methodology from "@/pages/Methodology";

describe("Methodology", () => {
  it("renders strategy introductions and expands details", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Methodology />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "策略介绍" })).toBeInTheDocument();
    expect(screen.getByText(/海龟交易/)).toBeInTheDocument();

    await user.click(screen.getByText(/海龟交易/));
    expect(screen.getByText("入场规则（概念）")).toBeInTheDocument();
  });
});
