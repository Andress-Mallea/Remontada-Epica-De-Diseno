import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { patients } from "@/data/mockData";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";
import { NewPatientDialog } from "@/components/patients/NewPatientDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Mail, Phone, Calendar } from "lucide-react";

export default function Pacientes() {
  const { hasRole } = useAuth();
  const { appointments } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ci.includes(searchTerm)
  );

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter((apt) => apt.patientId === patientId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">
              Directorio de pacientes registrados
            </p>
          </div>
          {/* CAMBIO: Solo el administrador puede ver el botón de Nuevo Paciente */}
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

        {/* Patients Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const patientAppointments = getPatientAppointments(patient.id);
            const lastAppointment = patientAppointments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            
            return (
              <Card key={patient.id} className="shadow-card animate-fade-in hover:shadow-elevated transition-shadow">
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

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron pacientes</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}