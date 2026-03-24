import { request } from "./client";
import type { PaginatedData, ReportRead, ReportDetailRead } from "./types";

export async function listReports(page = 1, pageSize = 20): Promise<PaginatedData<ReportRead>> {
  return request<PaginatedData<ReportRead>>("/reports", {
    params: { page, page_size: pageSize },
    auth: false,
  });
}

export async function getReport(reportId: number): Promise<ReportDetailRead> {
  return request<ReportDetailRead>(`/reports/${reportId}`, {
    auth: false,
  });
}
