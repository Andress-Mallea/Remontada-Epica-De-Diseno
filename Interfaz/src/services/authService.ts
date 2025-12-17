import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

const TOKEN_KEY = 'clinic_auth_token';
const USER_KEY = 'clinic_user';
const API_URL = 'http://localhost:8080/users'; // URL de tu Backend Java

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
   const response = await fetch('http://localhost:8080/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', 
  },
  body: JSON.stringify({ ci: credentials.ci, password: credentials.password }),
});

    if (!response.ok) {
      throw new Error('Credenciales inválidas (CI o contraseña incorrectos)');
    }

    const user = await response.json();
    const authResponse: AuthResponse = {
      user: user,
      token: `jwt_token_${user.id}` // Token simulado o real del backend
    };

    this.setSession(authResponse);
    return authResponse;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    const user = await response.json();
    const authResponse: AuthResponse = {
      user: user,
      token: `jwt_token_${user.id}`
    };

    this.setSession(authResponse);
    return authResponse;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}

export const authService = new AuthService();