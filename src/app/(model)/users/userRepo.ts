import { injectable } from 'tsyringe';
import { PaginatedUsersResponse, User, UserFilter, UserApiResponse } from './userModel';
import { ApiService } from '@/app/services/apiService';

@injectable()
export class UserRepository {
    constructor(private apiService: ApiService) {}

    async getUserById(id: string): Promise<User | null> {
        try {
            const result = await this.apiService.get<UserApiResponse<User>>(`/users/${id}`);
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            // The apiService already throws an error, but re-throwing ensures it propagates.
            throw error;
        }
    }

    async getAllUsers(
        page: number = 1,
        pageSize: number = 10,
        filter?: UserFilter
    ) {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
            });

            if (filter) {
                if (filter.username) queryParams.append('username', filter.username);
                if (filter.email) queryParams.append('email', filter.email);
                if (filter.accountStatus) queryParams.append('accountStatus', filter.accountStatus);
                if (filter.role) queryParams.append('role', filter.role);
            }

            const result = await this.apiService.get(`/getAllUsers?${queryParams.toString()}`);

            if (!result.success) {
                throw new Error(`API Error fetching users: ${result.message || 'Unknown error'}`);
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    async blockUser(id: string): Promise<UserApiResponse<User>> {
        try {
            const result = await this.apiService.put<UserApiResponse<User>>(`/users/${id}/block`, {});
            if (!result.success) {
                throw new Error(`API Error blocking user: ${result.message || 'Unknown error'}`);
            }
            return result;
        } catch (error) {
            console.error('Error blocking user:', error);
            throw error;
        }
    }

    async unblockUser(id: string): Promise<UserApiResponse<User>> {
        try {
            // Assuming the unblock endpoint is the same as block, just with a different internal logic on the backend
            const result = await this.apiService.put<UserApiResponse<User>>(`/users/${id}/unblock`, {});
             if (!result.success) {
                throw new Error(`API Error unblocking user: ${result.message || 'Unknown error'}`);
            }
            return result;
        } catch (error) {
            console.error('Error unblocking user:', error);
            throw error;
        }
    }
}

