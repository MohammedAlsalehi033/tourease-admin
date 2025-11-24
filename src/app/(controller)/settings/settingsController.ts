// src/app/(controller)/settings/settingsController.ts
import { AdminUser, ApiResponse, SettingsRepo } from '@/app/(model)/settings/settingsRepo';
import { injectable, inject } from 'tsyringe';

@injectable()
export class SettingsController {
  constructor(
    // Injects the SettingsRepository using tsyringe for dependency injection
    @inject(SettingsRepo) private settingsRepository: SettingsRepo
  ) {}

  /**
   * Fetches all admin users.
   * @returns A promise that resolves to an array of AdminUser objects.
   */
  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      return await this.settingsRepository.getAllAdmins();
    } catch (error) {
      console.error('Controller Error: Failed to get all admins.', error);
      // Depending on UI requirements, you might want to return an empty array
      // or let the error propagate to be handled by a UI boundary.
      return []; 
    }
  }

  /**
   * Promotes a user to an admin.
   * @param userId - The ID of the user to promote.
   * @returns A promise that resolves to an ApiResponse containing the new admin data.
   */
  async addAdmin(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      return await this.settingsRepository.addAdmin(userId);
    } catch (error) {
      console.error(`Controller Error: Failed to add admin for user ID ${userId}.`, error);
      // Re-throw the error to be handled by the component's state (e.g., show an error toast)
      throw error;
    }
  }

  /**
   * Removes admin privileges from a user.
   * @param userId - The ID of the user to demote.
   * @returns A promise that resolves to an ApiResponse.
   */
  async removeAdmin(userId: string): Promise<ApiResponse<null>> {
    try {
      return await this.settingsRepository.removeAdmin(userId);
    } catch (error) {
      console.error(`Controller Error: Failed to remove admin for user ID ${userId}.`, error);
      throw error;
    }
  }

  /**
   * Toggles the account status (active/deactivated) of a user.
   * @param userId - The ID of the user to update.
   * @returns A promise that resolves to an ApiResponse containing the updated user data.
   */
  async toggleUserStatus(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      return await this.settingsRepository.toggleUserStatus(userId);
    } catch (error) {
      console.error(`Controller Error: Failed to toggle status for user ID ${userId}.`, error);
      throw error;
    }
  }

  /**
   * Changes the permissions for an admin.
   * @param userId - The ID of the admin to update.
   * @param permissions - An array of new permission strings.
   * @returns A promise that resolves to an ApiResponse containing the updated admin data.
   */
  async changeAdminPermissions(userId: string, permissions: string[]): Promise<ApiResponse<AdminUser>> {
    // You could add business logic here, e.g., validating permissions before sending.
    if (!permissions || permissions.length === 0) {
        throw new Error("Permissions array cannot be empty.");
    }
    
    try {
      return await this.settingsRepository.changeAdminPermissions(userId, permissions);
    } catch (error) {
      console.error(`Controller Error: Failed to change permissions for user ID ${userId}.`, error);
      throw error;
    }
  }
}
