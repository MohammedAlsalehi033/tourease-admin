
import { injectable } from 'tsyringe';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface FetchOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

@injectable()
export class ApiService {
  readonly baseUrl: string = 'http://35.154.41.254:3003/api';
  readonly baseUrl2: string = 'http://localhost:3000/api';

  constructor() {

  }

   private async getAuthToken(): Promise<string | null> {

    if (typeof window === 'undefined') {
      try {
        const session = await getServerSession(authOptions);
        return session?.user?.firebaseToken || null;
      } catch (error) {
        console.error('Error getting server session:', error);
        return null;
      }
    } 
    
    else {
      try {
          const seestion = await getSession();
          return seestion?.user?.firebaseToken ?? "didi"
       
      } catch (error) {
        console.error('Error getting client-side Firebase token:', error);
        return null;
      }
    }
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
  // Generic fetch method with error handling
  private async fetchWithErrorHandling<T>(
    url: string,
    options: FetchOptions
  ): Promise<T> {
    try {
      console.log(`${this.baseUrl}${url}`, options);
      const response = await fetch(`${this.baseUrl}${url}`, options);
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(errorData , "errorData")
        throw new Error(
          errorData.message || `API request failed with status: ${JSON.stringify(response)}`
        );
      }

      // Parse response JSON
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // GET request method
  async get<T>(url: string): Promise<T> {
    const options: FetchOptions = {
      method: 'GET',
      headers: await this.getHeaders(),
    };

    return this.fetchWithErrorHandling<T>(url, options);
  }

  // POST request method
  async post<T>(url: string, body: Record<string, any> = {}, isFormData: boolean = false): Promise<T> {
    let header = await this.getHeaders();
    console.log(header)
    if(isFormData){
     header = {...await this.getHeaders(), "Content-Type": "application/json" }
    }
    const options: FetchOptions = {
      method: 'POST',
      headers: header,
      body: isFormData ? body : JSON.stringify(body),
    };

    return this.fetchWithErrorHandling<T>(url, options);
  }

  // PUT request method
  async put<T>(url: string, body: Record<string, any> = {}): Promise<T> {
    const options: FetchOptions = {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    };

    return this.fetchWithErrorHandling<T>(url, options);
  }

  // PATCH request method
  async patch<T>(url: string, body: Record<string, any> = {}): Promise<T> {
    const options: FetchOptions = {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    };

    return this.fetchWithErrorHandling<T>(url, options);
  }

  // DELETE request method
  async delete<T>(url: string): Promise<T> {
    const options: FetchOptions = {
      method: 'DELETE',
      headers: await this.getHeaders(),
    };

    return this.fetchWithErrorHandling<T>(url, options);
  }
}