import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppointments } from "@/context/AppointmentsContext";
import { Appointment } from "@/types/clinic";

interface AttendanceDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceDialog({ appointment, open, onOpenChange }: AttendanceDialogProps) {
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const { recordAttendance } = useAppointments();

  const handleSubmit = () => {
    if (!appointment || !reason.trim() || !diagnosis.trim()) return;

    recordAttendance(appointment.id, reason, diagnosis, notes || undefined);
    setReason("");
    setDiagnosis("");
    setNotes("");
    onOpenChange(false);
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Atención</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium">{appointment.patientName}</p>
            <p className="text-sm text-muted-foreground">CI: {appointment.patientCi}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {appointment.date} - {appointment.startTime}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de Consulta *</Label>
            <Textarea
              id="reason"
              placeholder="Describa el motivo de la consulta..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Textarea
              id="diagnosis"
              placeholder="Ingrese el diagnóstico..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Observaciones o indicaciones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!reason.trim() || !diagnosis.trim()}
          >
            Registrar y Cerrar Cita
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
