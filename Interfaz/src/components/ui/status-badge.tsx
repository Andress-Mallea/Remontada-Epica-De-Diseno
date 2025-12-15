import { cn } from "@/lib/utils";
import { AppointmentStatus, statusLabels } from "@/types/clinic";

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const statusStyles: Record<AppointmentStatus, string> = {
  solicitada: "bg-warning/15 text-warning border-warning/30",
  confirmada: "bg-primary/15 text-primary border-primary/30",
  cancelada: "bg-destructive/15 text-destructive border-destructive/30",
  atendida: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
