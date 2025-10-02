// src/controllers/productController.ts
import { injectable, inject } from 'tsyringe';
import { UserRepository } from '@/app/(model)/users/userRepo';
// Removed unused 'Product' import, adjusted type import path assuming 'userModel' is correct
import { PaginatedUsersResponse, User, UserFilter } from '@/app/(model)/users/userModel';

@injectable()
export class UserController {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository
  ) {}

  async getUserById(id: string): Promise<User | null> {
    try {
       return await this.userRepository.getUserById(id);
    } catch (error: any) {
         console.error(`Error in UserController getUserById for ID ${id}:`, error.message);
         // Depending on desired behavior, either re-throw or return a specific error response/null
         throw error; // Re-throwing for now
    }
  }

  async getAllUsers(
    page?: number,
    pageSize?: number,
    filter?: UserFilter
  ): Promise<PaginatedUsersResponse> {
     try {
         return await this.userRepository.getAllUsers(page, pageSize, filter);
     } catch (error: any) {
         console.error(`Error in UserController getAllUsers:`, error.message);
         throw error;
     }
  }

  async blockUser(id: string): Promise<{ success: boolean; message?: string; data?: User }> {
     try {
         return await this.userRepository.blockUser(id);
     } catch (error: any) {
          console.error(`Error in UserController blockUser for ID ${id}:`, error.message);
          throw error; // Re-throwing, potentially return { success: false, message: error.message } instead
     }
  }

  async unblockUser(id: string): Promise<{ success: boolean; message?: string; data?: User }> {
     try {
         return await this.userRepository.unblockUser(id);
     } catch (error: any) {
          console.error(`Error in UserController unblockUser for ID ${id}:`, error.message);
          throw error; // Re-throwing, potentially return { success: false, message: error.message } instead
     }
  } 
}