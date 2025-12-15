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
            {/* Ruta pública: Login/Registro */}
            <Route path="/auth" element={<Auth />} />

            {/* Rutas Protegidas */}
            
            {/* Dashboard: Solo Admin y Recepción */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'recepcion']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Agenda General: Admin, Recepción, Médico y PACIENTE */}
            <Route
              path="/agenda"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'recepcion', 'medico', 'paciente']}>
                  <Agenda />
                </ProtectedRoute>
              }
            />

            {/* Mi Agenda: Médico y PACIENTE */}
            <Route
              path="/mi-agenda"
              element={
                <ProtectedRoute allowedRoles={['medico', 'paciente']}>
                  <MiAgenda />
                </ProtectedRoute>
              }
            />

            {/* Citas (Gestión Activa): Admin y Recepción */}
            <Route
              path="/citas"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'recepcion']}>
                  <Citas />
                </ProtectedRoute>
              }
            />

            {/* 2. NUEVA RUTA: Historial de Citas (Admin y Recepción) */}
            <Route
              path="/historial"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'recepcion']}>
                  <HistorialCitas />
                </ProtectedRoute>
              }
            />

            {/* Médicos: Admin y Recepción */}
            <Route
              path="/medicos"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'recepcion']}>
                  <Medicos />
                </ProtectedRoute>
              }
            />

            {/* Pacientes: Admin y Recepción */}
            <Route
              path="/pacientes"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'recepcion']}>
                  <Pacientes />
                </ProtectedRoute>
              }
            />

            {/* Usuarios: Solo Admin */}
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            {/* Redirección por defecto y 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AppointmentsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;