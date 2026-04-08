import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Methodology from "@/pages/Methodology";

vi.mock("@/api/strategies", () => ({
  listStrategies: vi.fn().mockResolvedValue({
    items: [
      {
        id: 21,
        name: "TurtleTradingStrategy",
        description: "海龟交易策略",
        pairs: ["BTC/USDT"],
        strategy_type: "trend_following",
        total_return: null,
        annual_return: null,
        trade_count: null,
        max_drawdown: null,
        sharpe_ratio: null,
        win_rate: null,
      },
    ],
    total: 1,
    page: 1,
    page_size: 100,
  }),
}));

describe("Methodology", () => {
  it("renders strategy introductions and expands details", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Methodology />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "策略介绍" })).toBeInTheDocument();
    expect(await screen.findByText(/TurtleTradingStrategy/)).toBeInTheDocument();

    await user.click(screen.getByText(/TurtleTradingStrategy/));
    expect(screen.getByText("入场规则（概念）")).toBeInTheDocument();
  });
});
