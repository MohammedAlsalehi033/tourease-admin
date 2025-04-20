import { injectable, inject } from 'tsyringe';
import { ProvdersRepository } from '@/app/(model)/providers/providerRepo';
import { AccommodationProvider } from '../../(model)/providers/providersModel';
import { TransportationProvider } from '../../(model)/providers/providersModel';

@injectable()
export class ProviderController {
  constructor(
    @inject(ProvdersRepository) private adminRepository: ProvdersRepository
  ) {}

  // Transportation Provider Methods
  async getPendingTransportationProviders(status: string = 'active'): Promise<TransportationProvider[]> {
    console.log(`Controller: Fetching transportation providers with status: ${status}`);
    return await this.adminRepository.getTransportationProvidersByStatus(status);
  }

  async getTransportationProviderDetails(providerId: string): Promise<TransportationProvider | null> {
    console.log(`Controller: Fetching transportation provider details for ID: ${providerId}`);
    return await this.adminRepository.getTransportationProviderById(providerId);
  }

  async approveTransportationProvider(providerId: string): Promise<TransportationProvider | null> {
    console.log(`Controller: Approving transportation provider with ID: ${providerId}`);
    return await this.adminRepository.updateTransportationProviderStatus(providerId, 'accepted');
  }

  async rejectTransportationProvider(providerId: string): Promise<TransportationProvider | null> {
    console.log(`Controller: Rejecting transportation provider with ID: ${providerId}`);
    return await this.adminRepository.updateTransportationProviderStatus(providerId, 'rejected');
  }

  // Accommodation Provider Methods
  async getPendingAccommodationProviders(): Promise<AccommodationProvider[]> {
    console.log('Controller: Fetching pending accommodation providers');
    return await this.adminRepository.getPendingAccommodationProviders();
  }

  async getAccommodationProviderDetails(providerId: string): Promise<AccommodationProvider | null> {
    console.log(`Controller: Fetching accommodation provider details for ID: ${providerId}`);
    return await this.adminRepository.getAccommodationProviderById(providerId);
  }

  async approveAccommodationProvider(providerId: string): Promise<AccommodationProvider | null> {
    console.log(`Controller: Approving accommodation provider with ID: ${providerId}`);
    return await this.adminRepository.updateAccommodationProviderStatus(providerId, 'accepted');
  }

  async rejectAccommodationProvider(providerId: string): Promise<AccommodationProvider | null> {
    console.log(`Controller: Rejecting accommodation provider with ID: ${providerId}`);
    return await this.adminRepository.updateAccommodationProviderStatus(providerId, 'rejected');
  }

  // Helper methods that combine or transform data could be added here
  async getDashboardStats(): Promise<{
    pendingTransportation: number;
    pendingAccommodation: number;
  }> {
    console.log('Controller: Generating admin dashboard statistics');
    
    const transportationProviders = await this.adminRepository.getTransportationProvidersByStatus('pending');
    const accommodationProviders = await this.adminRepository.getPendingAccommodationProviders();
    
    return {
      pendingTransportation: transportationProviders.length,
      pendingAccommodation: accommodationProviders.length
    };
  }
}