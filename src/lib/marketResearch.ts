import { MARKET_BRIEFS } from "@/data/marketResearchMock";

export type MarketBrief = {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  tags: string[];
  contentMd: string;
};

export type ListMarketBriefsResponse = {
  briefs: MarketBrief[];
};

const API_BASE = "/api";
const USE_MOCK = true;

export async function listMarketBriefs(): Promise<ListMarketBriefsResponse> {
  if (USE_MOCK) {
    return { briefs: MARKET_BRIEFS };
  }
  const res = await fetch(`${API_BASE}/market-research/briefs`);
  if (!res.ok) throw new Error("请求失败");
  return (await res.json()) as ListMarketBriefsResponse;
}
