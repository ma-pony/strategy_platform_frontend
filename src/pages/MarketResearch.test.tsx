import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MarketResearch from "@/pages/MarketResearch";

describe("MarketResearch", () => {
  it("opens brief modal from list", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MarketResearch />
      </MemoryRouter>,
    );

    expect(screen.getByText("AI 市场研究")).toBeInTheDocument();

    await user.click(await screen.findByText(/风险偏好回升/));
    expect(screen.getByText("今日核心观点")).toBeInTheDocument();
  });
});
