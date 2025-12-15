import { MainLayout } from "@/components/layout/MainLayout";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentAppointments } from "@/components/dashboard/RecentAppointments";
import { WeeklySchedule } from "@/components/dashboard/WeeklySchedule";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenido al sistema de gestión de citas médicas
            </p>
          </div>
          <NewAppointmentDialog />
        </div>

        {/* Stats */}
        <StatsGrid />

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAppointments />
          <WeeklySchedule />
        </div>
      </div>
    </MainLayout>
  );
}
