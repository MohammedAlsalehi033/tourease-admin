import { ReportsRepo } from '@/app/(model)/reports/reportsRepo';
import { inject, injectable } from 'tsyringe';
@injectable()
export class reportsController {
    constructor(@inject(ReportsRepo) private reportsRepo: ReportsRepo) {}

    async getAllReports() {
        return this.reportsRepo.getAllReports();
    }
}
