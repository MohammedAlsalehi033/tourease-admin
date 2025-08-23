import { injectable } from 'tsyringe';
import { getApiUrl } from '../../lib/config';

import { AccommodationProvider,TransportationProvider } from './providersModel';

@injectable()
export class ProvdersRepository {
  private readonly apiBaseUrl = getApiUrl('/');

  async getTransportationProvidersByStatus(status: string = 'pending', page: number, pageSize: number): Promise<TransportationProvider[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/transportationProviders?status=${status}&page=${page}&pageSize=${pageSize}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transportation providers: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching transportation providers:', error);
      throw error;
    }
  }

  async getTransportationProviderById(providerId: string): Promise<TransportationProvider | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/transportationProviders/${providerId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch transportation provider: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching transportation provider by ID:', error);
      throw error;
    }
  }

  async updateTransportationProviderStatus(providerId: string, status: 'accepted' | 'rejected'): Promise<TransportationProvider | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/transportationProviders/${providerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update transportation provider status: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error updating transportation provider status:', error);
      throw error;
    }
  }

  // Accommodation Provider Methods
  async getPendingAccommodationProviders(): Promise<AccommodationProvider[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/accommodationProviders?status=active`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch accommodation providers: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching accommodation providers:', error);
      throw error;
    }
  }

  async getAccommodationProviderById(providerId: string): Promise<AccommodationProvider | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/accommodationProviders/${providerId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch accommodation provider: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching accommodation provider by ID:', error);
      throw error;
    }
  }

  async updateAccommodationProviderStatus(providerId: string, status: 'accepted' | 'rejected'): Promise<AccommodationProvider | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/accommodationProviders/${providerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update accommodation provider status: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error updating accommodation provider status:', error);
      throw error;
    }
  }
}