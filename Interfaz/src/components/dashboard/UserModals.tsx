// src/components/dashboard/UserModals.tsx
import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import { CreateUserRequest } from '@/services/userService';
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  // En lugar de string, usamos los tipos literales:
  type: 'ADMIN' | 'MEDIC' | 'PATIENT' | 'RECEPTIONIST'; 
}
export const CreateUserModal = ({ isOpen, onClose, type }: CreateUserModalProps) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    ci: '',
    name: '',
    email: '',
    password: '',
    tipo: type, // Ahora TypeScript entiende que 'type' es compatible
    specialty: ''
  });

  // Muy importante: Si el prop 'type' cambia (ej: de MEDIC a PATIENT),
  // debemos actualizar el campo 'tipo' dentro del estado.
  React.useEffect(() => {
    if (type) {
      setFormData(prev => ({ ...prev, tipo: type }));
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      toast.success(`${type} creado con éxito`);
      onClose();
    } catch (error) {
      toast.error("Error al crear");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Nuevo {type}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="CI" className="border w-full p-2" onChange={e => setFormData({...formData, ci: e.target.value})} />
          <input placeholder="Nombre completo" className="border w-full p-2" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input placeholder="Email" className="border w-full p-2" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" className="border w-full p-2" onChange={e => setFormData({...formData, password: e.target.value})} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};