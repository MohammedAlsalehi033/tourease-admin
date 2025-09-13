export type ReportStatus = 'pending' | 'resolved' | 'dismissed' | string;
export type ReportableType =
  | 'USER'
  | 'TRANSPORTATION_LISTING'
  | 'ACCOMMODATION'
  | 'ROOM'
  | 'REVIEW'
  | 'QUESTION'
  | 'COMMENT'
  | 'MESSAGE'
  | string;

export interface ReportUserRef {
  id: string;
  username: string;
  email: string;
}

export interface ReportAdminRef {
  adminId: string;
  user: {
    username: string;
    email: string;
  };
}

export interface ReportItem {
  id: number;
  reportableType: ReportableType;
  reportReason: string;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  reporterId: string;
  reportedUserId: string | null;
  transportationListingId: number | null;
  accommodationId: number | null;
  roomId: number | null;
  questionId: number | null;
  commentId: number | null;
  messageId: number | null;
  offerId: number | null;
  transportationBookingId: number | null;
  accommodationBookingId: number | null;
  reviewId: number | null;
  Admin?: ReportAdminRef | null;
  User_Report_reporterIdToUser?: ReportUserRef | null;
  User_Report_reportedUserIdToUser?: ReportUserRef | null;
}

export interface ReportsFilters {
  status?: ReportStatus;
  reportableType?: ReportableType;
  reporterId?: string;
}

export interface ReportsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportsResponse {
  success: boolean;
  data: {
    reports: ReportItem[];
    pagination: ReportsPagination;
  };
}

export interface PaginatedReports {
  reports: ReportItem[];
  pagination: ReportsPagination;
  success: boolean;
}

// Single report with deep context
export interface ReportDetail extends ReportItem {
  TransportationListing?: {
    id: number;
    startLocationText: string;
    endLocationText: string;
    departureTime: string;
    provider?: { user?: { username: string; email: string } };
  } | null;
  Accommodation?: {
    id: number;
    name: string;
    location: string;
    provider?: { user?: { username: string; email: string } };
  } | null;
  Room?: {
    id: number;
    roomType: string;
    pricePerNight: number;
    accommodation?: { name: string; location: string };
  } | null;
  Question?: {
    id: number;
    title: string;
    description: string;
    user?: { username: string; email: string };
  } | null;
  Comment?: {
    id: number;
    content: string;
    user?: { username: string; email: string };
    question?: { title: string };
  } | null;
  Message?: {
    id: number;
    content: string;
    sentAt: string;
    sender?: { username: string; email: string };
    receiver?: { username: string; email: string };
  } | null;
  Offer?: {
    id: number;
    pricePerSeat: number;
    message: string;
    sender?: { username: string; email: string };
    recipient?: { username: string; email: string };
  } | null;
  TransportationBooking?: {
    id: number;
    seatsBooked: number;
    totalPrice: number;
    traveler?: { username: string; email: string };
  } | null;
  AccommodationBooking?: {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    traveler?: { username: string; email: string };
  } | null;
  Review?: {
    id: number;
    rating: number;
    content: string;
    user?: { username: string; email: string };
    transportationListing?: { id: number; startLocationText: string; endLocationText: string };
    accommodation?: { id: number; name: string; location: string };
  } | null;
}

export interface ReportDetailResponse {
  success: boolean;
  data: ReportDetail;
}

export interface ReportStatusUpdateResponse {
  success: boolean;
  message: string;
  data: ReportDetail;
}


// Statistics types
export interface ReportsByTypeItem {
  type: ReportableType;
  count: number;
}

export interface ReportsByStatusItem {
  status: ReportStatus;
  count: number;
}

export interface ReportsStatisticsData {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  reportsByType: ReportsByTypeItem[];
  reportsByStatus: ReportsByStatusItem[];
}

export interface ReportsStatisticsResponse {
  success: boolean;
  data: ReportsStatisticsData;
}

export interface DeleteReportResponse {
  success: boolean;
  message: string;
}
