'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = url => fetch(url).then(r => r.json());

export default function DashboardAppointmentsPage() {
  const { data: events, error } = useSWR('/api/appointments', fetcher);
  const router = useRouter();

  if (error) return <p>Error al cargar citas</p>;
  if (!events) return <p>Cargando…</p>;

  // Mapear a formato FullCalendar
  const fcEvents = events.map(ev => ({
    id: ev.id,
    title: `${ev.property.title} — ${ev.lead?.name || ev.client?.name}`,
    start: ev.date,
    end: ev.date,
  }));

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h1>Reuniones / Visitas</h1>
        <button className="btn btn-primary" onClick={() => router.push('/dashboard/appointments/new')}>
          Nueva visita
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={fcEvents}
        height="auto"
        dateClick={info => router.push(`/dashboard/appointments/new?date=${info.dateStr}`)}
        eventClick={info => router.push(`/dashboard/appointments/${info.event.id}`)}
      />
    </div>
  );
}
