import { injectable } from 'tsyringe';
import { getAdminApiUrl } from '../../lib/config';
import {
  PaginatedReports,
  ReportsFilters,
  ReportsResponse,
  ReportDetail,
  ReportDetailResponse,
} from './reportsModel';

@injectable()
export class ReportsRepository {
  private readonly apiBaseUrl = getAdminApiUrl('/reports');

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

  async listReports(
    page: number = 1,
    limit: number = 10,
    filters?: ReportsFilters
  ): Promise<PaginatedReports> {
    const query = this.buildQuery({ page, limit, ...filters });
    const response = await fetch(`${this.apiBaseUrl}${query}`);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch reports (${response.status}): ${body || response.statusText}`);
    }

    const data: ReportsResponse = await response.json();
    if (!data.success) {
      throw new Error('API returned unsuccessful response for reports');
    }

    return {
      reports: data.data.reports,
      pagination: data.data.pagination,
      success: data.success,
    };
  }

  async getReportById(id: number): Promise<ReportDetail> {
    const response = await fetch(`${this.apiBaseUrl}/${id}`);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch report (${response.status}): ${body || response.statusText}`);
    }
    const data: ReportDetailResponse = await response.json();
    if (!data.success) {
      throw new Error('API returned unsuccessful response for report');
    }
    return data.data;
  }
}


