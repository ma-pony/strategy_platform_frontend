import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MarketResearch from "@/pages/MarketResearch";

vi.mock("@/api/reports", () => ({
  listReports: vi.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        title: "BTC 周度市场分析",
        summary: "本周比特币在关键支撑位获得支撑",
        generated_at: "2026-03-24T00:00:00Z",
        related_coins: ["BTC"],
      },
    ],
    total: 1,
    page: 1,
    page_size: 20,
  }),
  getReport: vi.fn().mockResolvedValue({
    id: 1,
    title: "BTC 周度市场分析",
    summary: "本周比特币在关键支撑位获得支撑",
    content: "## 今日核心观点\n- 比特币走势分析",
    generated_at: "2026-03-24T00:00:00Z",
    related_coins: ["BTC"],
  }),
}));

describe("MarketResearch", () => {
  it("opens brief modal from list", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MarketResearch />
      </MemoryRouter>,
    );

    expect(screen.getByText("AI 市场研究")).toBeInTheDocument();

    await user.click(await screen.findByText(/BTC 周度市场分析/));
    expect(await screen.findByText("今日核心观点")).toBeInTheDocument();
  });
});
