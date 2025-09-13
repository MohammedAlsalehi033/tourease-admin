import { injectable } from "tsyringe";
import { ApiService } from "@/app/services/apiService";
import { PaginatedReports, ReportDetail, ReportsFilters, ReportsResponse, ReportDetailResponse, ReportsStatisticsResponse, ReportStatusUpdateResponse, DeleteReportResponse } from "./reportsModel";

@injectable()
export class ReportsRepo {
  constructor(private apiService: ApiService) {}

  private buildQuery(params?: ReportsFilters & { page?: number; limit?: number }): string {
    const query = new URLSearchParams();
    if (!params) return '';
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    if (params.reportableType) query.set('reportableType', params.reportableType);
    if (params.reporterId) query.set('reporterId', params.reporterId);
    const str = query.toString();
    return str ? `?${str}` : '';
  }

  async listReports(page: number = 1, limit: number = 10, filters?: ReportsFilters): Promise<PaginatedReports> {
    const qs = this.buildQuery({ page, limit, ...filters });
    const result = await this.apiService.get<ReportsResponse>(`/reports${qs}`);
    return {
      reports: result.data.reports,
      pagination: result.data.pagination,
      success: result.success,
    };
  }

  async getReportById(id: number): Promise<ReportDetail> {
    const result = await this.apiService.get<ReportDetailResponse>(`/reports/${id}`);
    return result.data;
  }

  // GET /api/reports/type/:type
  async listReportsByType(type: string, page: number = 1, limit: number = 10, status?: ReportsFilters["status"]): Promise<PaginatedReports> {
    const qs = this.buildQuery({ page, limit, status });
    const result = await this.apiService.get<ReportsResponse>(`/reports/type/${encodeURIComponent(type)}${qs}`);
    return {
      reports: result.data.reports,
      pagination: result.data.pagination,
      success: result.success,
    };
  }

  // GET /api/reports/user/:userId
  async listReportsByUser(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedReports> {
    const qs = this.buildQuery({ page, limit });
    const result = await this.apiService.get<ReportsResponse>(`/reports/user/${encodeURIComponent(userId)}${qs}`);
    return {
      reports: result.data.reports,
      pagination: result.data.pagination,
      success: result.success,
    };
  }

  // GET /api/reports/statistics
  async getReportsStatistics(): Promise<ReportsStatisticsResponse> {
    const result = await this.apiService.get<ReportsStatisticsResponse>(`/reports/statistics`);
    return result;
  }

  // PATCH /api/reports/:id/status
  async updateReportStatus(id: number, status: string, resolutionNotes?: string): Promise<ReportStatusUpdateResponse> {
    const body: Record<string, any> = { status };
    if (typeof resolutionNotes === 'string') {
      body.resolutionNotes = resolutionNotes;
    }
    const result = await this.apiService.patch<ReportStatusUpdateResponse>(`/reports/${id}/status`, body);
    return result;
  }

  // DELETE /api/reports/:id
  async deleteReport(id: number): Promise<DeleteReportResponse> {
    const result = await this.apiService.delete<DeleteReportResponse>(`/reports/${id}`);
    return result;
  }
}
