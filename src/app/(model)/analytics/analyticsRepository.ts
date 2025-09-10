import { injectable } from 'tsyringe';
import { getAdminApiUrl } from '../../lib/config';
import {
    AnalyticsOverviewData,
    UserAnalyticsData,
    BookingAnalyticsData,
    ContentAnalyticsData,
    RatingAnalyticsData,
    ProviderAnalyticsData,
    AnalyticsFilters,
    AnalyticsExportFilters
} from './analyticsModel';
import { ApiService } from '@/app/services/apiService';

export interface AnalyticsApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

@injectable()
export class AnalyticsRepository {
    constructor(private apiService: ApiService) {}
    
    private readonly apiBaseUrl = getAdminApiUrl('/admin');

    private buildQueryString(params?: any): string {
        if (!params) return '';
        const query = Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
        return query ? `?${query}` : '';
    }

    async getAnalyticsOverview(): Promise<AnalyticsOverviewData | null> {
        try {
            const response = await this.apiService.get<AnalyticsApiResponse<AnalyticsOverviewData>>('/admin//overview');
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching overview analytics:', error);
            throw error;
        }
    }

    async getUserAnalytics(filters?: AnalyticsFilters): Promise<UserAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await this.apiService.get<AnalyticsApiResponse<UserAnalyticsData>>(`/admin/users${queryString}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching user analytics:', error);
            throw error;
        }
    }

    async getTransportationBookingAnalytics(filters?: AnalyticsFilters): Promise<BookingAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await this.apiService.get<AnalyticsApiResponse<BookingAnalyticsData>>(`/admin/bookings/transportation${queryString}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching transportation booking analytics:', error);
            throw error;
        }
    }

    async getAccommodationBookingAnalytics(filters?: AnalyticsFilters): Promise<BookingAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await this.apiService.get<AnalyticsApiResponse<BookingAnalyticsData>>(`/admin/bookings/accommodation${queryString}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching accommodation booking analytics:', error);
            throw error;
        }
    }

    async getContentAnalytics(filters?: AnalyticsFilters): Promise<ContentAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await this.apiService.get<AnalyticsApiResponse<ContentAnalyticsData>>(`/admin/content${queryString}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching content analytics:', error);
            throw error;
        }
    }

    async getRatingAnalytics(filters?: AnalyticsFilters): Promise<RatingAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await this.apiService.get<AnalyticsApiResponse<RatingAnalyticsData>>(`/admin/ratings${queryString}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching rating analytics:', error);
            throw error;
        }
    }

    async getProviderAnalytics(filters?: AnalyticsFilters): Promise<ProviderAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await this.apiService.get<AnalyticsApiResponse<ProviderAnalyticsData>>(`/admin/providers${queryString}`);
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching provider analytics:', error);
            throw error;
        }
    }

    async exportAnalytics(filters: AnalyticsExportFilters): Promise<Blob | any | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/export${queryString}`);

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Export failed: ${response.statusText}`);
                } catch (jsonError) {
                    throw new Error(`Export failed: ${response.statusText}`);
                }
            }

            const contentType = response.headers.get('Content-Type');

            if (filters.format === 'pdf' || contentType?.includes('application/pdf')) {
                return await response.blob();
            } else if (filters.format === 'csv' || contentType?.includes('text/csv')) {
                return await response.blob();
            } else {
                const data = await response.json();
                return data.success ? data.data : data;
            }
        } catch (error) {
            console.error('Error exporting analytics:', error);
            throw error;
        }
    }
}

