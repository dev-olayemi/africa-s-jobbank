// API Configuration and Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'seeker' | 'agent' | 'business' | 'company';
  profilePhoto?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  companyName?: string;
  companySize?: string;
  industry?: string;
  verification: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    business: boolean;
  };
  skills?: string[];
  experience?: {
    level: string;
    years: number;
  };
  cvUrl?: string;
  connections?: any[];
  followers?: any[];
  following?: any[];
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    verificationRequired?: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param: string }>;
}

// Token Management
class TokenManager {
  private static TOKEN_KEY = 'jobfolio_token';
  private static USER_KEY = 'jobfolio_user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  static clear(): void {
    this.removeToken();
    this.removeUser();
  }
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = TokenManager.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Log detailed error for debugging
        console.error('API Error Response:', data);
        
        // Provide user-friendly error messages
        let errorMessage = data.message || 'Something went wrong. Please try again.';
        
        // If there are validation errors, show them
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map((err: any) => err.msg || err.message).join(', ');
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      // Re-throw with user-friendly message
      throw new Error(error.message || 'Network error. Please check your connection.');
    }
  }

  // Auth Endpoints
  async signup(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    companyName?: string;
    companySize?: string;
    industry?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse['data']>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      TokenManager.setToken(response.data.token);
      TokenManager.setUser(response.data.user);
    }

    return response as AuthResponse;
  }

  async login(credentials: {
    identifier: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse['data']>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      TokenManager.setToken(response.data.token);
      TokenManager.setUser(response.data.user);
    }

    return response as AuthResponse;
  }

  async verifyEmail(code: string): Promise<ApiResponse> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async resendVerification(): Promise<ApiResponse> {
    return this.request('/auth/resend-verification', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      TokenManager.clear();
    }
  }

  // User Endpoints
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/users/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async searchUsers(params: {
    q?: string;
    role?: string;
    location?: string;
    skills?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/users/search?${queryString}`);
  }

  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/users/${id}`);
  }

  // Job Endpoints
  async getJobs(params?: {
    q?: string;
    category?: string;
    location?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/jobs${queryString ? `?${queryString}` : ''}`);
  }

  async getJobById(id: string): Promise<ApiResponse> {
    return this.request(`/jobs/${id}`);
  }

  async getJob(id: string): Promise<ApiResponse> {
    return this.getJobById(id);
  }

  async createJob(jobData: any): Promise<ApiResponse> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async applyToJob(jobId: string, applicationData?: any): Promise<ApiResponse> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({
        job: jobId,
        ...applicationData
      }),
    });
  }

  async saveJob(jobId: string): Promise<ApiResponse> {
    return this.request(`/jobs/${jobId}/save`, {
      method: 'POST',
    });
  }

  async unsaveJob(jobId: string): Promise<ApiResponse> {
    return this.request(`/jobs/${jobId}/save`, {
      method: 'DELETE',
    });
  }

  async getSavedJobs(): Promise<ApiResponse> {
    return this.request('/jobs/saved');
  }

  async updateJob(id: string, updates: any): Promise<ApiResponse> {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteJob(id: string): Promise<ApiResponse> {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyJobs(params?: { status?: string; page?: number }): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/jobs/my/posted${queryString ? `?${queryString}` : ''}`);
  }

  async getJobCategories(): Promise<ApiResponse> {
    return this.request('/jobs/categories');
  }

  async getMyPostedJobs(params?: { page?: number; limit?: number }): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/jobs/my/posted${queryString ? `?${queryString}` : ''}`);
  }


  // Application Endpoints
  async getApplications(params?: {
    status?: string;
    jobId?: string;
    page?: number;
  }): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/applications${queryString ? `?${queryString}` : ''}`);
  }

  async submitApplication(applicationData: {
    job: string;
    coverLetter?: string;
    expectedSalary?: number;
    resume?: string;
  }): Promise<ApiResponse> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplicationStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse> {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Upload Endpoints
  async uploadProfilePhoto(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    const token = TokenManager.getToken();
    
    if (!token) {
      console.error('No auth token found. Please log in again.');
      return {
        success: false,
        message: 'Authentication required. Please log in again.'
      };
    }

    const response = await fetch(`${this.baseURL}/upload/profile-photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async uploadJobImage(formData: FormData): Promise<ApiResponse> {
    const token = TokenManager.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Authentication required. Please log in again.'
      };
    }

    const response = await fetch(`${this.baseURL}/upload/job-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async uploadCV(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('cv', file);

    const token = TokenManager.getToken();
    
    if (!token) {
      console.error('No auth token found. Please log in again.');
      return {
        success: false,
        message: 'Authentication required. Please log in again.'
      };
    }

    const response = await fetch(`${this.baseURL}/upload/cv`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async uploadMedia(files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('media', file));

    const token = TokenManager.getToken();
    const response = await fetch(`${this.baseURL}/upload/media`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    return response.json();
  }

  // Network/Connection Endpoints
  async connectUser(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/connect`, {
      method: 'POST',
    });
  }

  async disconnectUser(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/connect`, {
      method: 'DELETE',
    });
  }

  async followUser(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/follow`, {
      method: 'DELETE',
    });
  }

  async getUserConnections(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/connections`);
  }

  async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}`);
  }

  // Post Endpoints
  async getPosts(params?: { page?: number; limit?: number; type?: string; hashtag?: string; author?: string }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request(`/posts${queryParams ? `?${queryParams}` : ''}`);
  }

  async createPost(data: { content: string; media?: any[]; isPublic?: boolean }): Promise<ApiResponse> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: string): Promise<ApiResponse> {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async commentOnPost(postId: string, content: string): Promise<ApiResponse> {
    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deletePost(postId: string): Promise<ApiResponse> {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Job Recommendations
  async getJobRecommendations(limit?: number): Promise<ApiResponse> {
    return this.request(`/jobs/recommendations${limit ? `?limit=${limit}` : ''}`);
  }

  // Network Suggestions
  async getNetworkSuggestions(limit?: number): Promise<ApiResponse> {
    return this.request(`/users/suggestions${limit ? `?limit=${limit}` : ''}`);
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
export { TokenManager };
export default api;