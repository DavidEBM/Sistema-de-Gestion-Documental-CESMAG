"use client";

import {
  Activity,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  FileSpreadsheet,
  FileText,
  Plus,
  UploadCloud,
} from "lucide-react";
import { useMemo, useState } from "react";

type EventKind = "upload" | "edit" | "snies" | "approved-report" | "approved-snies";

type CalendarEvent = {
  id: string;
  date: string;
  kind: EventKind;
  title: string;
  detail: string;
};

const calendarEvents: CalendarEvent[] = [
  { id: "upload-1", date: "2026-11-03", kind: "upload", title: "Informe jornada docente", detail: "Archivo subido a Informes" },
  { id: "edit-1", date: "2026-11-07", kind: "edit", title: "Informe jornada docente", detail: "Se editó la sección de resultados" },
  { id: "snies-1", date: "2026-11-12", kind: "snies", title: "Registro SNIES · jornada docente", detail: "Registro enviado por Ana Rodríguez" },
  { id: "approved-report-1", date: "2026-11-18", kind: "approved-report", title: "Informe jornada docente", detail: "Aprobación de informe por la jefatura" },
  { id: "upload-2", date: "2026-11-20", kind: "upload", title: "Certificado capacitación", detail: "Evidencia subida a la actividad" },
  { id: "snies-2", date: "2026-11-20", kind: "snies", title: "Registro SNIES · investigación", detail: "Archivo actualizado" },
  { id: "approved-snies-1", date: "2026-11-20", kind: "approved-snies", title: "Actualización SNIES · investigación", detail: "Aprobación de actualización por la jefatura" },
];

const eventMeta: Record<EventKind, { label: string; icon: typeof UploadCloud; className: string }> = {
  upload: { label: "Archivo subido", icon: UploadCloud, className: "event-upload" },
  edit: { label: "Archivo editado", icon: FileEdit, className: "event-edit" },
  snies: { label: "SNIES", icon: FileSpreadsheet, className: "event-snies" },
  "approved-report": { label: "Aprobación de informe", icon: BadgeCheck, className: "event-approved-report" },
  "approved-snies": { label: "Aprobación de actualización SNIES", icon: BadgeCheck, className: "event-approved-snies" },
};

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function DashboardCalendar() {
  const [viewDate, setViewDate] = useState(() => new Date(2026, 10, 20));
  const [selectedDate, setSelectedDate] = useState("2026-11-20");

  const days = useMemo(() => {
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: offset + totalDays }, (_, index) => {
      if (index < offset) return null;
      return new Date(viewDate.getFullYear(), viewDate.getMonth(), index - offset + 1);
    });
  }, [viewDate]);

  const selectedEvents = calendarEvents.filter((event) => event.date === selectedDate);
  const monthLabel = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(viewDate);

  function moveMonth(direction: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
    setSelectedDate("");
  }

  return (
    <section className="card calendar-panel">
      <div className="calendar-heading">
        <div>
          <div className="eyebrow">Trazabilidad institucional</div>
          <h2><CalendarDays size={19} /> Calendario de actividad</h2>
          <p>Consulta cuándo se subieron, editaron o aprobaron archivos y registros SNIES.</p>
        </div>
        <div className="calendar-nav" aria-label="Cambiar mes">
          <button className="icon-button" type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior"><ChevronLeft size={17} /></button>
          <strong>{monthLabel}</strong>
          <button className="icon-button" type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente"><ChevronRight size={17} /></button>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-grid-wrap">
          <div className="calendar-weekdays">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              if (!day) return <div className="calendar-day empty" key={`empty-${index}`} />;
              const key = dateKey(day);
              const dayEvents = calendarEvents.filter((event) => event.date === key);
              const isSelected = selectedDate === key;
              return (
                <button className={`calendar-day ${isSelected ? "selected" : ""} ${dayEvents.length ? "has-day-events" : ""}`} type="button" key={key} onClick={() => setSelectedDate(key)} aria-label={`${formatDate(day)}${dayEvents.length ? `, ${dayEvents.length} eventos` : ""}`}>
                  <span>{day.getDate()}</span>
                  {dayEvents.length > 0 && <i className="day-dots" aria-hidden="true">{dayEvents.slice(0, 3).map((event) => <b className={eventMeta[event.kind].className} key={event.id} />)}</i>}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            {Object.entries(eventMeta).map(([kind, meta]) => <span key={kind}><i className={`legend-dot ${meta.className}`} />{meta.label}</span>)}
          </div>
        </div>

        {selectedEvents.length > 0 && (
          <aside className="calendar-events" aria-live="polite">
            <div className="calendar-events-heading"><span>Actividad del día</span><strong>{formatDate(new Date(`${selectedDate}T12:00:00`))}</strong></div>
            <div className="calendar-event-list">
              {selectedEvents.map((event) => {
                const meta = eventMeta[event.kind];
                const Icon = meta.icon;
                return <article className="calendar-event" key={event.id}><div className={`calendar-event-icon ${meta.className}`}><Icon size={16} /></div><div><strong>{event.title}</strong><p>{event.detail}</p><span>{meta.label}</span></div></article>;
              })}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="content">
      <div className="page-header">
        <div><div className="eyebrow">Miércoles, 20 de noviembre de 2026</div><h1>Buenos días, Ana</h1></div>
        <a className="primary" href="/actividades"><Plus size={17} /> Nueva actividad</a>
      </div>

      <section className="cards dashboard-stats" aria-label="Resumen de indicadores">
        <article className="card stat stat-detail">
          <div className="stat-head"><span>Actividades</span><div className="stat-icon"><Activity size={18} /></div></div>
          <div className="stat-main"><strong>24</strong><span>activas / creadas este semestre</span></div>
          <div className="stat-breakdown"><span><b>24</b> Activas</span><span><b>6</b> Inactivas</span></div>
        </article>
        <article className="card stat stat-detail">
          <div className="stat-head"><span>Informes</span><div className="stat-icon stat-icon-warm"><FileText size={18} /></div></div>
          <div className="stat-main"><strong>32</strong><span>totales del usuario</span></div>
          <div className="stat-breakdown"><span><b>5</b> Pendientes de subir</span><span><b>19</b> Subidos por mí</span></div>
        </article>
        <article className="card stat stat-detail">
          <div className="stat-head"><span>Informes aprobados</span><div className="stat-icon stat-icon-green"><CheckCircle2 size={18} /></div></div>
          <div className="stat-main"><strong>18</strong><span>para el usuario ingresado</span></div>
          <div className="stat-breakdown"><span><b>18</b> Aprobados</span><span><b>2</b> En revisión</span></div>
        </article>
        <article className="card stat stat-detail">
          <div className="stat-head"><span>SNIES</span><div className="stat-icon stat-icon-gold"><FileSpreadsheet size={18} /></div></div>
          <div className="stat-main"><strong>14</strong><span>actividades subidas por mí</span></div>
          <div className="stat-breakdown"><span><b>3</b> Pendientes de subir</span><span><b>14</b> Totales subidas</span></div>
        </article>
      </section>

      <div className="grid-2">
        <section className="card panel">
          <div className="section-heading"><h2>Actividades recientes</h2><a href="/actividades">Ver todas</a></div>
          {[
            ["18", "nov", "Jornada de capacitación docente", "Vicerrectoría académica", "Aprobado", ""],
            ["21", "nov", "Encuentro de investigación", "Investigación", "En revisión", "review"],
            ["25", "nov", "Feria de ciencias", "Ciencias básicas", "Borrador", "pending"],
          ].map(([day, month, name, department, state, type]) => <div className="activity-row" key={name}><div className="date-box"><strong>{day}</strong>{month}</div><div><strong>{name}</strong><div className="eyebrow">{department}</div></div><span className={`status ${type}`}>{state}</span></div>)}
        </section>
        <section className="card panel">
          <div className="section-heading"><h2>Documentos recientes</h2><a href="/informes">Ver todos</a></div>
          {[
            { label: "Último cambio de SNIES", document: "Reporte SNIES 2026", activity: "SNIES · Actualización", status: "Actualizado ayer", icon: FileSpreadsheet, iconClass: "stat-icon-gold" },
            { label: "Último informe", document: "Informe jornada docente", activity: "Informe · Creación", status: "Creado hoy", icon: FileText, iconClass: "stat-icon-warm" },
            { label: "Último archivo", document: "Certificado capacitación", activity: "Archivo · Subida", status: "Subido hace 2 días", icon: UploadCloud, iconClass: "" },
          ].map(({ label, document, activity, status, icon: Icon, iconClass }) => <div className="activity-row" key={label}><div className={`stat-icon ${iconClass}`.trim()}><Icon size={17} /></div><div><strong>{label}</strong><div className="eyebrow">{document} · {activity}</div></div><span className="status">{status}</span></div>)}
        </section>
      </div>

      <DashboardCalendar />
    </div>
  );
}
