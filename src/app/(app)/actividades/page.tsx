"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Plus, Search, X } from "lucide-react";

type ActivityRecord = {
  id: string;
  code: string;
  name: string;
  responsible: string;
  startDate: string;
  endDate: string;
  department: string;
  type: string;
  status: string;
  description: string;
  objective: string;
  time: string;
  place: string;
  modality: string;
  program: string;
  results: string;
  observations: string;
  createdAt: string;
};

type ActivityForm = Omit<ActivityRecord, "id" | "code" | "status" | "createdAt">;

const STORAGE_KEY = "cesmag-local-activities";
const seedActivities: ActivityRecord[] = [
  { id: "activity-1", code: "ACT-2026-001", name: "Jornada de capacitación docente", responsible: "Ana Rodríguez", startDate: "2026-11-18", endDate: "2026-11-18", department: "Vicerrectoría académica", type: "Capacitación", status: "Aprobado", description: "", objective: "Fortalecer las competencias docentes.", time: "08:00", place: "Auditorio San Francisco", modality: "Presencial", program: "", results: "", observations: "", createdAt: "2026-06-15T09:00:00.000Z" },
  { id: "activity-2", code: "ACT-2026-002", name: "Encuentro de investigación", responsible: "Carlos Méndez", startDate: "2026-11-21", endDate: "2026-11-21", department: "Investigación", type: "Investigación", status: "En revisión", description: "", objective: "Compartir resultados de investigación institucional.", time: "14:00", place: "Sala de juntas", modality: "Híbrida", program: "", results: "", observations: "", createdAt: "2026-10-18T09:00:00.000Z" },
  { id: "activity-3", code: "ACT-2026-003", name: "Feria de ciencias", responsible: "Laura Pérez", startDate: "2026-11-25", endDate: "2026-11-25", department: "Ciencias básicas", type: "Extensión", status: "Borrador", description: "", objective: "Acercar la ciencia a la comunidad universitaria.", time: "09:00", place: "Plaza institucional", modality: "Presencial", program: "", results: "", observations: "", createdAt: "2026-02-12T09:00:00.000Z" },
];

const emptyForm: ActivityForm = {
  name: "",
  responsible: "Ana Rodríguez",
  startDate: "",
  endDate: "",
  department: "",
  type: "Capacitación",
  description: "",
  objective: "",
  time: "",
  place: "",
  modality: "Presencial",
  program: "",
  results: "",
  observations: "",
};

function loadActivities(): ActivityRecord[] {
  if (typeof window === "undefined") return seedActivities;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as ActivityRecord[] | null;
    return stored?.length ? stored : seedActivities;
  } catch {
    return seedActivities;
  }
}

function formatActivityDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export default function ActivitiesPage() {
  const [records, setRecords] = useState<ActivityRecord[]>(loadActivities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<ActivityForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => records.filter((record) =>
    (!search || `${record.name} ${record.code} ${record.responsible} ${record.department}`.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "Todas" || record.status === statusFilter)
  ), [records, search, statusFilter]);

  function updateForm(field: keyof ActivityForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", form: "" }));
  }

  function openCreate() {
    setForm(emptyForm);
    setErrors({});
    setShowCreate(true);
  }

  function persist(next: ActivityRecord[]) {
    setRecords(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function createActivity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredFields: Array<keyof ActivityForm> = ["name", "type", "startDate", "endDate", "department"];
    const nextErrors: Record<string, string> = {};
    requiredFields.forEach((field) => { if (!form[field].trim()) nextErrors[field] = "Este campo es obligatorio."; });
    if (form.startDate && form.endDate && form.endDate < form.startDate) nextErrors.endDate = "Debe ser igual o posterior a la fecha de inicio.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }

    const activity: ActivityRecord = {
      ...form,
      id: crypto.randomUUID(),
      code: `ACT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      status: "Borrador",
      createdAt: new Date().toISOString(),
    };
    persist([activity, ...records]);
    setShowCreate(false);
    setForm(emptyForm);
  }

  return (
    <div className="content">
      <div className="page-header">
        <div><div className="eyebrow">Gestión institucional</div><h1>Actividades</h1></div>
        <button className="primary" type="button" onClick={openCreate}><Plus size={17} /> Crear actividad</button>
      </div>

      <section className="card panel">
        <div className="top-actions activity-toolbar">
          <div className="search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar actividad" /></div>
          <select aria-label="Filtrar estado" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todas</option><option>Borrador</option><option>En revisión</option><option>Aprobado</option></select>
        </div>
        <div className="table-scroll"><table className="table"><thead><tr><th>Actividad</th><th>Responsable</th><th>Fecha</th><th>Dependencia</th><th>Estado</th></tr></thead><tbody>
          {filtered.map((record) => <tr key={record.id}><td><strong>{record.name}</strong><small className="table-subtitle">{record.code}</small></td><td>{record.responsible}</td><td>{formatActivityDate(record.startDate)}</td><td>{record.department}</td><td><span className={`status ${record.status === "Borrador" ? "pending" : record.status === "En revisión" ? "review" : ""}`}>{record.status}</span></td></tr>)}
          {!filtered.length && <tr><td colSpan={5}><div className="document-empty">No hay actividades que coincidan con la búsqueda.</div></td></tr>}
        </tbody></table></div>
      </section>

      {showCreate && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}>
        <section className="system-dialog activity-dialog" role="dialog" aria-modal="true" aria-labelledby="create-activity-title">
          <button className="dialog-close" type="button" aria-label="Cerrar" onClick={() => setShowCreate(false)}><X size={18} /></button>
          <div className="dialog-icon"><CalendarDays size={21} /></div>
          <h2 id="create-activity-title">Crear actividad</h2>
          <p>Completa los campos mínimos para registrar una actividad. Los datos adicionales pueden agregarse después.</p>
          <form onSubmit={createActivity} noValidate>
            <div className="form-section-label">Datos mínimos obligatorios</div>
            <div className="modal-form-grid">
              <div className="field full"><label htmlFor="activity-name">Nombre de la actividad <span>*</span></label><input id="activity-name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} aria-invalid={Boolean(errors.name)} autoFocus />{errors.name && <small className="field-error">{errors.name}</small>}</div>
              <div className="field"><label htmlFor="activity-type">Tipo <span>*</span></label><select id="activity-type" value={form.type} onChange={(event) => updateForm("type", event.target.value)}><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select>{errors.type && <small className="field-error">{errors.type}</small>}</div>
              <div className="field"><label htmlFor="activity-department">Dependencia <span>*</span></label><input id="activity-department" value={form.department} onChange={(event) => updateForm("department", event.target.value)} aria-invalid={Boolean(errors.department)} />{errors.department && <small className="field-error">{errors.department}</small>}</div>
              <div className="field"><label htmlFor="activity-start">Fecha de inicio <span>*</span></label><input id="activity-start" type="date" value={form.startDate} onChange={(event) => updateForm("startDate", event.target.value)} aria-invalid={Boolean(errors.startDate)} />{errors.startDate && <small className="field-error">{errors.startDate}</small>}</div>
              <div className="field"><label htmlFor="activity-end">Fecha de finalización <span>*</span></label><input id="activity-end" type="date" value={form.endDate} onChange={(event) => updateForm("endDate", event.target.value)} aria-invalid={Boolean(errors.endDate)} />{errors.endDate && <small className="field-error">{errors.endDate}</small>}</div>
            </div>
            <div className="form-section-label optional-label">Información opcional</div>
            <div className="modal-form-grid">
              <div className="field full"><label htmlFor="activity-description">Descripción</label><textarea id="activity-description" value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="¿En qué consiste la actividad?" /></div>
              <div className="field full"><label htmlFor="activity-objective">Objetivo</label><textarea id="activity-objective" value={form.objective} onChange={(event) => updateForm("objective", event.target.value)} placeholder="Propósito institucional" /></div>
              <div className="field"><label htmlFor="activity-time">Hora</label><input id="activity-time" type="time" value={form.time} onChange={(event) => updateForm("time", event.target.value)} /></div>
              <div className="field"><label htmlFor="activity-place">Lugar</label><div className="input-with-icon"><MapPin size={15} /><input id="activity-place" value={form.place} onChange={(event) => updateForm("place", event.target.value)} placeholder="Lugar o enlace" /></div></div>
              <div className="field"><label htmlFor="activity-modality">Modalidad</label><select id="activity-modality" value={form.modality} onChange={(event) => updateForm("modality", event.target.value)}><option>Presencial</option><option>Virtual</option><option>Híbrida</option></select></div>
              <div className="field"><label htmlFor="activity-program">Programa / proyecto</label><input id="activity-program" value={form.program} onChange={(event) => updateForm("program", event.target.value)} /></div>
              <div className="field full"><label htmlFor="activity-results">Resultados esperados</label><textarea id="activity-results" value={form.results} onChange={(event) => updateForm("results", event.target.value)} /></div>
              <div className="field full"><label htmlFor="activity-observations">Observaciones</label><textarea id="activity-observations" value={form.observations} onChange={(event) => updateForm("observations", event.target.value)} /></div>
            </div>
            <div className="dialog-actions"><button className="secondary" type="button" onClick={() => setShowCreate(false)}>Cancelar</button><button className="primary" type="submit">Crear actividad</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
