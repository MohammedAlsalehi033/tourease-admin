import { injectable } from 'tsyringe';
import {
    AnalyticsOverviewData,
    UserAnalyticsData,
    BookingAnalyticsData,
    ContentAnalyticsData,
    RatingAnalyticsData,
    ProviderAnalyticsData,
    AnalyticsFilters,
    AnalyticsExportFilters
} from './analyticsModel'; // Adjust path as needed

@injectable()
export class AnalyticsRepository {
    private readonly apiBaseUrl = 'http://localhost:3000/api/admin/'; // Ensure this matches your backend analytics route base

    private buildQueryString(params?: Record<string, string | number | undefined>): string {
        if (!params) return '';
        const query = Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
        return query ? `?${query}` : '';
    }

    async getAnalyticsOverview(): Promise<AnalyticsOverviewData | null> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/overview`);
            if (!response.ok) {
                throw new Error(`Failed to fetch overview analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching overview analytics:', error);
            throw error;
        }
    }

    async getUserAnalytics(filters?: AnalyticsFilters): Promise<UserAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/users${queryString}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching user analytics:', error);
            throw error;
        }
    }

    async getTransportationBookingAnalytics(filters?: AnalyticsFilters): Promise<BookingAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/bookings/transportation${queryString}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch transportation booking analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching transportation booking analytics:', error);
            throw error;
        }
    }

    async getAccommodationBookingAnalytics(filters?: AnalyticsFilters): Promise<BookingAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/bookings/accommodation${queryString}`);
             if (!response.ok) {
                throw new Error(`Failed to fetch accommodation booking analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching accommodation booking analytics:', error);
            throw error;
        }
    }

    async getContentAnalytics(filters?: AnalyticsFilters): Promise<ContentAnalyticsData | null> {
         try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/content${queryString}`);
             if (!response.ok) {
                throw new Error(`Failed to fetch content analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching content analytics:', error);
            throw error;
        }
    }

    async getRatingAnalytics(filters?: AnalyticsFilters): Promise<RatingAnalyticsData | null> {
        try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/ratings${queryString}`);
             if (!response.ok) {
                throw new Error(`Failed to fetch rating analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching rating analytics:', error);
            throw error;
        }
    }

    async getProviderAnalytics(filters?: AnalyticsFilters): Promise<ProviderAnalyticsData | null> {
         try {
            const queryString = this.buildQueryString(filters);
            const response = await fetch(`${this.apiBaseUrl}/providers${queryString}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch provider analytics: ${response.statusText}`);
            }
            const data = await response.json();
            return data.success ? data.data : null;
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
                 // Attempt to read error message from JSON body if possible
                 try {
                     const errorData = await response.json();
                     throw new Error(errorData.message || `Export failed: ${response.statusText}`);
                 } catch (jsonError) {
                     // Fallback if response is not JSON
                     throw new Error(`Export failed: ${response.statusText}`);
                 }
            }

            // Handle based on requested format or Content-Type header
            const contentType = response.headers.get('Content-Type');

            if (filters.format === 'pdf' || contentType?.includes('application/pdf')) {
                return await response.blob();
            } else if (filters.format === 'csv' || contentType?.includes('text/csv')) {
                 // Could return blob or text depending on how you want to handle CSV
                 return await response.blob();
                // return await response.text();
            } else { // Default to JSON
                const data = await response.json();
                 return data.success ? data.data : data; // Return full response if not standard success format
            }
        } catch (error) {
            console.error('Error exporting analytics:', error);
            throw error;
        }
    }
}