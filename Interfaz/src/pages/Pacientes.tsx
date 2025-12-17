import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";
import { NewPatientDialog } from "@/components/patients/NewPatientDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Mail, Phone, Calendar, Loader2 } from "lucide-react";

// Definimos la interfaz para el tipado correcto
interface Patient {
  id: string;
  name: string;
  ci: string;
  email: string;
  phone: string;
}

export default function Pacientes() {
  const { hasRole } = useAuth();
  const { appointments } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  
  // ESTADO PARA DATOS REALES
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DE PACIENTES AL CARGAR
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/role/PATIENT');
        if (!response.ok) throw new Error("Error al obtener pacientes");
        const data = await response.json();
        console.log("DATOS RECIBIDOS DEL BACKEND:", data);
        // Mapeamos los datos del backend (que vienen con CI, Name, etc.) a nuestra interfaz
        const mappedPatients = data.map((p) => ({
          id: p.ci, // Usamos la CI como ID
          name: p.name || p.Name,
          ci: p.ci || p.CI,
          email: p.email || p.Email,
          phone: p.phone || "No registrado"
        }));
        
        setPatients(mappedPatients);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ci.includes(searchTerm)
  );

  const getPatientAppointments = (patientCi: string) => {
    // Filtramos las citas que coincidan con la CI del paciente
    return appointments.filter((apt) => apt.patientCi === patientCi);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">
              Directorio de pacientes reales registrados en el sistema
            </p>
          </div>
          {hasRole('ADMINISTRATOR') && <NewPatientDialog />}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o CI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => {
              const patientAppointments = getPatientAppointments(patient.ci);
              const lastAppointment = [...patientAppointments]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
              
              return (
                <Card key={patient.ci} className="shadow-card animate-fade-in hover:shadow-elevated transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{patient.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">CI: {patient.ci}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Citas totales:</span>
                        <span className="font-medium">{patientAppointments.length}</span>
                      </div>
                      {lastAppointment && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Última: {lastAppointment.date}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron pacientes registrados</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}