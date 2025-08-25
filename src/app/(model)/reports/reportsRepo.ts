import { getApiUrl } from "@/app/lib/config";
import { injectable } from "tsyringe";
import { Report } from "./reportsModel";
@injectable()
export class ReportsRepo {

  private readonly apiBaseUrl = getApiUrl('/questions');
    // Methods for fetching and managing reports would go here

    async getAllReports(): Promise<Report[]> {
   const dummy : Report[] = [{
       id: 1,
       content: {
           type: 'question',
           id: 123,
           link: '/questions/123'
       },
       reporter: {
           id: 456,
           name: 'John Doe'
       },
       reason: 'Inappropriate content',
       status: 'PENDING',
       createdAt: '2023-01-01T00:00:00Z'
   }];
        return dummy;
    }

    // async getReportById(id: number): Promise<Report | null> {
    //     // Implementation for fetching a report by ID
    // }

    // async createReport(report: Report): Promise<Report> {
    //     // Implementation for creating a new report
    // }

    // async updateReport(id: number, updatedReport: Partial<Report>): Promise<Report | null> {
    //     // Implementation for updating a report
    // }

    // async deleteReport(id: number): Promise<boolean> {
    //     // Implementation for deleting a report
    // }
}
