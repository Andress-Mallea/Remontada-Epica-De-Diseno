import { AuthResponse, LoginCredentials, RegisterData, User, UserRole } from '@/types/auth';

const TOKEN_KEY = 'clinic_auth_token';
const USER_KEY = 'clinic_user';

// Mock users actualizados con CI para login
const mockUsers: (User & { password: string })[] = [
  { id: '1', ci: '1111111', email: 'admin@clinica.com', password: 'admin123', name: 'Administrador General', role: 'administrador' },
  { id: '2', ci: '2222222', email: 'recepcion@clinica.com', password: 'recepcion123', name: 'María García', role: 'recepcion' },
  { id: '3', ci: '3333333', email: 'medico@clinica.com', password: 'medico123', name: 'Dr. Carlos Rodríguez', role: 'medico', specialty: 'medicina-general' },
  { id: '4', ci: '12345678', email: 'paciente@clinica.com', password: 'paciente123', name: 'Juan Pérez', role: 'paciente' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(500);
    
    // CAMBIO: Buscamos por CI en lugar de email
    const user = mockUsers.find(u => u.ci === credentials.ci && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Credenciales inválidas (CI o contraseña incorrectos)');
    }

    const { password, ...userWithoutPassword } = user;
    const mockResponse: AuthResponse = {
      user: userWithoutPassword,
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
    };

    this.setSession(mockResponse);
    return mockResponse;
  }

  // ... (El resto de métodos register, logout, etc. se mantienen igual)
  
  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(500);
    
    // Validación por CI en lugar de email para evitar duplicados
    if (mockUsers.find(u => u.ci === data.ci)) {
      throw new Error('El CI ya está registrado');
    }

    const newUser: User = {
      id: `${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      ci: data.ci, // Nos aseguramos de guardar el CI
      specialty: data.specialty,
    };

    mockUsers.push({ ...newUser, password: data.password });

    const mockResponse: AuthResponse = {
      user: newUser,
      token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
    };

    this.setSession(mockResponse);
    return mockResponse;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }
}

export const authService = new AuthService();