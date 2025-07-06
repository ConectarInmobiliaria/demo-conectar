'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function CalendarDashboard({ appointments }) {
  // Convertimos las citas a eventos de FullCalendar
  const events = appointments.map(a => ({
    id: a.id,
    title: `${a.agentName} — ${a.propertyTitle}`,
    start: a.date,
  }));

  return (
    <FullCalendar
      plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
      initialView="dayGridMonth"
      initialDate={dayjs().format('YYYY-MM-DD')}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      height="auto"
    />
  );
}
