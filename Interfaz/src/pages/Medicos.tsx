import { MainLayout } from "@/components/layout/MainLayout";
import { doctors } from "@/data/mockData";
import { specialtyLabels } from "@/types/clinic";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";
import { NewDoctorDialog } from "@/components/doctors/NewDoctorDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, CheckCircle } from "lucide-react";

export default function Medicos() {
  const { hasRole } = useAuth();
  const { appointments } = useAppointments();

  const getDoctorStats = (doctorId: string) => {
    const doctorAppointments = appointments.filter((apt) => apt.doctorId === doctorId);
    return {
      total: doctorAppointments.length,
      pending: doctorAppointments.filter((apt) => apt.status === "solicitada" || apt.status === "confirmada").length,
      completed: doctorAppointments.filter((apt) => apt.status === "atendida").length,
    };
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Médicos</h1>
            <p className="text-muted-foreground">
              Directorio de profesionales médicos de la clínica
            </p>
          </div>
          {hasRole('ADMINISTRATOR') && <NewDoctorDialog />}
        </div>

        {/* Doctors Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => {
            const stats = getDoctorStats(doctor.id);
            return (
              <Card key={doctor.id} className="shadow-card animate-fade-in hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary">
                      <Stethoscope className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {specialtyLabels[doctor.specialty]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="bg-warning/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground">Pendientes</p>
                    </div>
                    <div className="bg-success/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-success">{stats.completed}</p>
                      <p className="text-xs text-muted-foreground">Atendidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
