// app/dashboard/appointments/new/page.js
"use client";

import { Suspense } from "react";
import NewAppointmentForm from "@/components/dashboard/appointments/NewAppointmentForm";

export const dynamic = "force-dynamic";

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NewAppointmentForm />
    </Suspense>
  );
}