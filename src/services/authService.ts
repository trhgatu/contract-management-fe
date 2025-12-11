import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'manager' | 'admin';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'manager' | 'admin';
    status: 'active' | 'inactive';
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

class AuthService {
    // Login user
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        if (response.data.success && response.data.token) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }

        return response.data;
    }

    // Register new user (admin only)
    async register(data: RegisterData): Promise<{ success: boolean; data: User }> {
        const response = await api.post<{ success: boolean; data: User }>('/auth/register', data);
        return response.data;
    }

    // Logout user
    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        // Redirect to login
        window.location.href = '/login';
    }

    // Get current user from API
    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ success: boolean; data: User }>('/auth/me');
        if (response.data.success) {
            this.setUser(response.data.data);
            return response.data.data;
        }
        throw new Error('Failed to get current user');
    }

    // Update user profile
    async updateProfile(data: {
        name?: string;
        email?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<User> {
        const response = await api.put<{ success: boolean; data: User }>('/auth/profile', data);
        if (response.data.success) {
            this.setUser(response.data.data);
            return response.data.data;
        }
        throw new Error('Failed to update profile');
    }

    // Get token from localStorage
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    // Set token to localStorage
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    // Get user from localStorage
    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    // Set user to localStorage
    setUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Check if user has specific role(s)
    hasRole(...roles: string[]): boolean {
        const user = this.getUser();
        if (!user) return false;
        return roles.includes(user.role);
    }

    // Check if user is admin
    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    // Check if user is manager or admin
    canManage(): boolean {
        return this.hasRole('admin', 'manager');
    }
}

export default new AuthService();
