import { injectable } from "tsyringe";
import { ApiService } from "@/app/services/apiService";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: "Active" | "Deactivated";
  roles: Role[];
  createdAt: string;
  updatedAt: string;
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
  constructor(private apiService: ApiService) {}

  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const response = await this.apiService.get<AdminUser[]>(
        `/admin/super/admins`
      );
      return response;
    } catch (error) {
      console.error("Error in getAllAdmins:", error);
      throw error;
    }
  }

  async addAdmin(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await this.apiService.post<ApiResponse<AdminUser>>(
        `/admin/super/admins`,
        { userId }
      );
      return response;
    } catch (error) {
      console.error("Error in addAdmin:", error);
      throw error;
    }
  }

  async removeAdmin(userId: string): Promise<ApiResponse<null>> {
    try {
      const response = await this.apiService.delete<ApiResponse<null>>(
        `/admin/super/admins/${userId}`
      );
      return response;
    } catch (error) {
      console.error("Error in removeAdmin:", error);
      throw error;
    }
  }

  async toggleUserStatus(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await this.apiService.put<ApiResponse<AdminUser>>(
        `/admin/super/admins/${userId}/status`
      );
      return response;
    } catch (error) {
      console.error("Error in toggleUserStatus:", error);
      throw error;
    }
  }

  async changeAdminPermissions(
    userId: string,
    permissions: string[]
  ): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await this.apiService.put<ApiResponse<AdminUser>>(
        `/admin/super/admins/${userId}/permissions`,
        { permissions }
      );
      return response;
    } catch (error) {
      console.error("Error in changeAdminPermissions:", error);
      throw error;
    }
  }
}
