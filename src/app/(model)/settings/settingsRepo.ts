// src/app/(model)/admin/adminRepo.ts
import { injectable } from 'tsyringe';
import { getApiUrl } from '../../lib/config';

// We can define a simple type for an Admin user for better type-safety
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: 'Active' | 'Deactivated';
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  // Add any other fields that come from your API
}

export interface Role {
  userId: string;
  roleId: string;
  role: {
    id: string;
    roleName: string;
  };
  
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

@injectable()
export class SettingsRepo {
  // Set the base URL for admin-related endpoints
  private readonly apiBaseUrl = getApiUrl('/admin/super');

  /**
   * Fetches a list of all admin users from the backend.
   * Corresponds to: GET /admins
   */
  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/admins`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Gracefully handle non-json errors
        throw new Error(`Failed to fetch admins: ${errorData.error || response.statusText}`);
      }
      
      // Assuming the API returns the array of admins directly
      return await response.json();
    } catch (error) {
      console.error('Error in getAllAdmins:', error);
      throw error;
    }
  }

  /**
   * Promotes a user to an admin role.
   * Corresponds to: POST /admins
   * @param userId The ID of the user to make an admin.
   */
  async addAdmin(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      // NOTE: Your controller expects `userId` from `req.params`, but your router is `POST /admins`.
      // This function sends `userId` in the body to match the router.
      // If you change the route to `POST /admins/:userId`, this fetch URL should be changed.
      const response = await fetch(`${this.apiBaseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to add admin (${response.status})`);
      }

      return {
        success: true,
        message: responseData.message || 'Admin added successfully',
        data: responseData.data,
      };
    } catch (error) {
      console.error('Error in addAdmin:', error);
      throw error;
    }
  }

  /**
   * Removes the admin role from a user.
   * Corresponds to: DELETE /admins/:id
   * @param userId The ID of the user to remove admin privileges from.
   */
  async removeAdmin(userId: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${userId}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to remove admin (${response.status})`);
      }

      return {
        success: true,
        message: responseData.message || 'Admin removed successfully',
      };
    } catch (error) {
      console.error('Error in removeAdmin:', error);
      throw error;
    }
  }

  /**
   * Toggles a user's status between 'active' and 'deactivated'.
   * Corresponds to: PUT /admins/:id/status
   * @param userId The ID of the user whose status will be toggled.
   */
  async toggleUserStatus(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${userId}/status`, {
        method: 'PUT',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to toggle user status (${response.status})`);
      }

      return {
        success: true,
        message: responseData.message || 'User status updated successfully',
        data: responseData.data,
      };
    } catch (error) {
      console.error('Error in toggleUserStatus:', error);
      throw error;
    }
  }

  /**
   * Updates the permissions for a specific admin.
   * Corresponds to: PUT /admins/:id/permissions
   * @param userId The ID of the admin to update.
   * @param permissions An array of strings for the new permissions.
   */
  async changeAdminPermissions(userId: string, permissions: string[]): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${userId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to update permissions (${response.status})`);
      }

      return {
        success: true,
        message: responseData.message || 'Permissions updated successfully',
        data: responseData.data,
      };
    } catch (error) {
      console.error('Error in changeAdminPermissions:', error);
      throw error;
    }
  }
}
