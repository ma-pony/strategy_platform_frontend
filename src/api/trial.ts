import { request } from "./client";
import { getVisitorId } from "@/lib/visitorId";

type TrialRecord = {
  visitor_id: string;
  created_at: number;
  expires_at: number;
  remaining_seconds?: number;
};

export type TrialStatus = {
  active: boolean;
  trial: TrialRecord;
};

export async function initTrial(): Promise<void> {
  const visitor_id = await getVisitorId();
  await request("/trial/init", {
    method: "POST",
    auth: false,
    body: { visitor_id, user_agent: navigator.userAgent },
  });
}

export async function getTrialStatus(): Promise<TrialStatus> {
  return request<TrialStatus>("/trial/status", { auth: false });
}
