import { injectable, inject } from 'tsyringe';
import { ReportsRepo } from '@/app/(model)/reports/reportsRepo';
import { PaginatedReports, ReportsFilters, ReportDetail, ReportsStatisticsResponse, ReportStatusUpdateResponse, DeleteReportResponse } from '@/app/(model)/reports/reportsModel';

@injectable()
export class ReportsController {
  constructor(
    @inject(ReportsRepo) private reportsRepository: ReportsRepo
  ) {}

  async listReports(
    page: number = 1,
    limit: number = 10,
    filters?: ReportsFilters
  ): Promise<PaginatedReports> {
    return this.reportsRepository.listReports(page, limit, filters);
  }

  async getReportById(id: number): Promise<ReportDetail> {
    return this.reportsRepository.getReportById(id);
  }

  async listReportsByType(type: string, page: number = 1, limit: number = 10, status?: ReportsFilters["status"]): Promise<PaginatedReports> {
    return this.reportsRepository.listReportsByType(type, page, limit, status);
  }

  async listReportsByUser(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedReports> {
    return this.reportsRepository.listReportsByUser(userId, page, limit);
  }

  async getReportsStatistics(): Promise<ReportsStatisticsResponse> {
    return this.reportsRepository.getReportsStatistics();
  }

  async updateReportStatus(id: number, status: string, resolutionNotes?: string): Promise<ReportStatusUpdateResponse> {
    return this.reportsRepository.updateReportStatus(id, status, resolutionNotes);
  }

  async deleteReport(id: number): Promise<DeleteReportResponse> {
    return this.reportsRepository.deleteReport(id);
  }
}


