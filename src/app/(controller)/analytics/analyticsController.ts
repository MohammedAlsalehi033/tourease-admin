import { injectable, inject } from 'tsyringe';
import {
    AnalyticsOverviewData,
    UserAnalyticsData,
    BookingAnalyticsData,
    ContentAnalyticsData,
    RatingAnalyticsData,
    ProviderAnalyticsData,
    AnalyticsFilters,
    AnalyticsExportFilters
    
} from '@/app/(model)/analytics/analyticsModel'; // Adjust path as needed
import { AnalyticsRepository } from '@/app/(model)/analytics/analyticsRepository';

@injectable()
export class AnalyticsController {
    constructor(
        @inject(AnalyticsRepository) private analyticsRepository: AnalyticsRepository
    ) {
        // Bind 'this' for all methods that access instance properties/methods
        this.getAnalyticsOverview = this.getAnalyticsOverview.bind(this);
        this.getUserAnalytics = this.getUserAnalytics.bind(this);
        this.getTransportationBookingAnalytics = this.getTransportationBookingAnalytics.bind(this);
        this.getAccommodationBookingAnalytics = this.getAccommodationBookingAnalytics.bind(this);
        this.getContentAnalytics = this.getContentAnalytics.bind(this);
        this.getRatingAnalytics = this.getRatingAnalytics.bind(this);
        this.getProviderAnalytics = this.getProviderAnalytics.bind(this);
        this.exportAnalytics = this.exportAnalytics.bind(this);
    }


    async getAnalyticsOverview(): Promise<AnalyticsOverviewData | null> {
        return this.analyticsRepository.getAnalyticsOverview();
    }

    async getUserAnalytics(filters?: AnalyticsFilters): Promise<UserAnalyticsData | null> {
        return this.analyticsRepository.getUserAnalytics(filters);
    }

    async getTransportationBookingAnalytics(filters?: AnalyticsFilters): Promise<BookingAnalyticsData | null> {
        return this.analyticsRepository.getTransportationBookingAnalytics(filters);
    }

    async getAccommodationBookingAnalytics(filters?: AnalyticsFilters): Promise<BookingAnalyticsData | null> {
        return this.analyticsRepository.getAccommodationBookingAnalytics(filters);
    }

    async getContentAnalytics(filters?: AnalyticsFilters): Promise<ContentAnalyticsData | null> {
        return this.analyticsRepository.getContentAnalytics(filters);
    }

    async getRatingAnalytics(filters?: AnalyticsFilters): Promise<RatingAnalyticsData | null> {
        return this.analyticsRepository.getRatingAnalytics(filters);
    }

    async getProviderAnalytics(filters?: AnalyticsFilters): Promise<ProviderAnalyticsData | null> {
        return this.analyticsRepository.getProviderAnalytics(filters);
    }

    async exportAnalytics(filters: AnalyticsExportFilters): Promise<Blob | any | null> {
        // Note: The return type might need adjustment based on how you handle file downloads
        return this.analyticsRepository.exportAnalytics(filters);
    }
}