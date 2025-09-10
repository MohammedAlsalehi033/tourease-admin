import { injectable, inject } from 'tsyringe';
import { ReportsRepository } from '@/app/(model)/reports/reportsRepository';
import { PaginatedReports, ReportsFilters, ReportDetail } from '@/app/(model)/reports/reportsModel';

@injectable()
export class ReportsController {
  constructor(
    @inject(ReportsRepository) private reportsRepository: ReportsRepository
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
}


