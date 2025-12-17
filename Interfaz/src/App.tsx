import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Agenda from "@/pages/Agenda";
import Citas from "@/pages/Citas";
import HistorialCitas from "@/pages/HistorialCitas"; // 1. Nueva importación
import Medicos from "@/pages/Medicos";
import Pacientes from "@/pages/Pacientes";
import Usuarios from "@/pages/Usuarios";
import MiAgenda from "@/pages/MiAgenda";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentsProvider>
         <Routes>
  {/* Ruta pública */}
  <Route path="/auth" element={<Auth />} />

  {/* Dashboard: Admin y Recepción */}
  <Route
    path="/"
    element={
      <ProtectedRoute allowedRoles={['ADMINISTRATOR', 'RECEPTIONIST', 'administrador', 'recepcion']}>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  {/* Agenda General: Todos */}
  <Route
    path="/agenda"
    element={
      <ProtectedRoute allowedRoles={['ADMINISTRATOR', 'RECEPTIONIST', 'MEDIC', 'PATIENT', 'administrador', 'recepcion', 'medico', 'paciente']}>
        <Agenda />
      </ProtectedRoute>
    }
  />

  {/* Mi Agenda: Médico y Paciente */}
  <Route
    path="/mi-agenda"
    element={
      <ProtectedRoute allowedRoles={['MEDIC', 'PATIENT', 'medico', 'paciente']}>
        <MiAgenda />
      </ProtectedRoute>
    }
  />

  {/* Usuarios: Solo Admin */}
  <Route
    path="/usuarios"
    element={
      <ProtectedRoute allowedRoles={['ADMINISTRATOR', 'administrador']}>
        <Usuarios />
      </ProtectedRoute>
    }
  />
  
  {/* Aplica lo mismo para /citas, /historial, /medicos y /pacientes */}
  <Route
    path="/citas"
    element={
      <ProtectedRoute allowedRoles={['ADMINISTRATOR', 'RECEPTIONIST', 'administrador', 'recepcion']}>
        <Citas />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<NotFound />} />
</Routes>
          <Toaster />
        </AppointmentsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;