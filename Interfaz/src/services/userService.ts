// src/services/userService.ts

const API_URL = 'http://localhost:8080/users';
export interface BackendUser {
  id: string;
  ci: string;
  name: string;
  email: string;
  rol: {toString(): string;}
  specialty?: string;
}
export interface BackendDoctor extends BackendUser {
  specialty: string; // Aquí ya no marcará error
}
export const userService = {
  /**
   * Busca un usuario por su CI en el backend.
   * El backend verifica que el usuario exista y que sea de tipo 'PATIENT'.
   */
  async searchByCi(ci: string) {
    const response = await fetch(`${API_URL}/search/${ci}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Si implementas seguridad más adelante, aquí iría el token:
        // 'Authorization': `Bearer ${localStorage.getItem('clinic_auth_token')}`
      },
    });

    if (!response.ok) {
      // Maneja los errores 404 (No encontrado) o 400 (No es paciente) enviados por Java
      const errorText = await response.text();
      throw new Error(errorText || 'Error al buscar el paciente');
    }

    // Retorna el objeto User (id, ci, name, email, tipo) desde la base de datos
    return response.json();
  },

  /**
   * Opcional: Obtener todos los usuarios (útil para la página de Usuarios)
   */
  async getAllUsers() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener la lista de usuarios');
    return response.json();
  },
  async getMedics(): Promise<BackendDoctor[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener médicos');
  
  const users: BackendUser[] = await response.json();
  
  // Filtramos asegurándonos de usar el campo 'rol'
  const filtered = users.filter((u): u is BackendDoctor => {
    // 1. Extraemos el valor de 'rol' (que ya vimos que es un String "MEDIC")
    const roleValue = u.rol ? String(u.rol).toUpperCase() : "";
    
    // 2. Verificamos que sea MEDIC y que tenga specialty (que no sea null)
    return roleValue === 'MEDIC' && u.specialty !== null;
  });


  return filtered;
}
};