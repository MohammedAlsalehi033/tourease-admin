// Assuming basic types like CountOverTime might be defined elsewhere or redefine here
// Redefining for clarity if not shared from a common types package

export interface CountOverTime {
    date: string; // Expecting formatted date string from backend
    count: number;
}

export interface ValueOverTime {
    date: string; // Expecting formatted date string from backend
    value: number; // Expecting number after backend Decimal conversion
}

export interface GroupedCount {
    category: string | number;
    count: number;
}

export interface GroupedAverage {
    category: string | number;
    average: number | null;
}

// Specific data structures returned by controller methods

export interface AnalyticsOverviewData {
    totalUsers: number;
    totalBookings: number;
    totalTransportationBookings: number;
    totalAccommodationBookings: number;
    totalRevenue: number;
    averageRating: number;
}

export interface UserAnalyticsData {
    registrationsOverTime: CountOverTime[];
    countByRole: GroupedCount[];
    countByStatus: GroupedCount[];
}

export interface BookingAnalyticsData {
    volumeOverTime: CountOverTime[];
    valueOverTime: ValueOverTime[];
    averageBookingValue: number | null;
    statusDistribution: GroupedCount[];
    // Add optional fields for popular routes/locations if implemented
    // popularRoutes?: GroupedCount[];
    // popularLocations?: GroupedCount[];
}

export interface ContentAnalyticsData {
    questionsOverTime: CountOverTime[];
    reviewsOverTime: CountOverTime[];
    offerStatusCounts: GroupedCount[];
}

export interface RatingAnalyticsData {
    averageRatingOverall: number | null;
    averageRatingByType: GroupedAverage[];
    ratingDistribution: GroupedCount[];
}

export interface ProviderAnalyticsData {
    transportProviderStatusCounts: GroupedCount[];
    accommodationProviderCount: number;
}

// --- Filter Types (can be shared in a common types file) ---

export interface DateRangeFilter {
    startDate?: string; // Use string format YYYY-MM-DD for query params
    endDate?: string;
}

export interface StatusFilter {
    status?: string;
}

export interface IntervalFilter {
     interval?: 'day' | 'week' | 'month';
}

export interface ReviewableTypeFilter {
    reviewableType?: string;
}

// Combined filter type used by repository methods
export type AnalyticsFilters = DateRangeFilter & StatusFilter & IntervalFilter & ReviewableTypeFilter;

// Specific filters for export
export interface AnalyticsExportFilters extends AnalyticsFilters {
     reportType: string; // e.g., 'overview', 'users', 'bookings_transportation'
     format: 'json' | 'pdf' | 'csv';
}