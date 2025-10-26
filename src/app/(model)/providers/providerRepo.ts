import { injectable } from "tsyringe";
import { ApiService } from "@/app/services/apiService";
import {
  AccommodationProvider,
  TransportationProvider,
} from "./providersModel";

export interface ProviderApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@injectable()
export class ProvdersRepository {
  constructor(private apiService: ApiService) {}

  async getTransportationProvidersByStatus(
    status: string = "pending",
    page: number,
    pageSize: number
  ): Promise<TransportationProvider[]> {
    try {
      const url = `/transportationProviders?status=${status}&page=${page}&pageSize=${pageSize}`;
      const response = await this.apiService.get<
        ProviderApiResponse<TransportationProvider[]>
      >(url);
      return response.success ? response.data : [];
    } catch (error) {
      console.error("Error fetching transportation providers:", error);
      throw error;
    }
  }

  async getTransportationProviderById(
    providerId: string
  ): Promise<TransportationProvider | null> {
    try {
      const response = await this.apiService.get<
        ProviderApiResponse<TransportationProvider>
      >(`/transportationProviders/${providerId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching transportation provider by ID:", error);
      throw error;
    }
  }

  async updateTransportationProviderStatus(
    providerId: string,
    status: "accepted" | "rejected"
  ): Promise<TransportationProvider | null> {
    try {
      const response = await this.apiService.put<
        ProviderApiResponse<TransportationProvider>
      >(`/transportationProviders/${providerId}/status`, { status });
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error updating transportation provider status:", error);
      throw error;
    }
  }

  async getPendingAccommodationProviders(): Promise<AccommodationProvider[]> {
    try {
      const response = await this.apiService.get<
        ProviderApiResponse<AccommodationProvider[]>
      >(`/accommodationProviders?status=active`);
      return response.success ? response.data : [];
    } catch (error) {
      console.error("Error fetching accommodation providers:", error);
      throw error;
    }
  }

  async getAccommodationProviderById(
    providerId: string
  ): Promise<AccommodationProvider | null> {
    try {
      const response = await this.apiService.get<
        ProviderApiResponse<AccommodationProvider>
      >(`/accommodationProviders/${providerId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching accommodation provider by ID:", error);
      throw error;
    }
  }

  async updateAccommodationProviderStatus(
    providerId: string,
    status: "accepted" | "rejected"
  ): Promise<AccommodationProvider | null> {
    try {
      const response = await this.apiService.put<
        ProviderApiResponse<AccommodationProvider>
      >(`/accommodationProviders/${providerId}/status`, { status });
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error updating accommodation provider status:", error);
      throw error;
    }
  }
}
