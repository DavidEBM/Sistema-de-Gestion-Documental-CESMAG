"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, Download, Eye, EyeOff, FilePlus2, FileSpreadsheet, Save, Send, Trash2, X } from "lucide-react";

type ActivityOption = { id: string; name: string; startDate: string; department: string; createdAt: string };

type SniesRecord = {
  id: string;
  code: string;
  fileTitle: string;
  activityId: string;
  activityCreatedAt: string;
  name: string;
  date: string;
  place: string;
  department: string;
  observations: string;
  type: string;
  updatedAt: string;
  localSaved: boolean;
  uploaded: boolean;
};

const STORAGE_KEY = "cesmag-local-snies";
const ACTIVITY_STORAGE_KEY = "cesmag-local-activities";

const fallbackActivities: ActivityOption[] = [
  { id: "activity-1", name: "Jornada de capacitación docente", startDate: "2026-11-18", department: "Vicerrectoría académica", createdAt: "2026-06-15T09:00:00.000Z" },
  { id: "activity-2", name: "Encuentro de investigación", startDate: "2026-11-21", department: "Investigación", createdAt: "2026-10-18T09:00:00.000Z" },
  { id: "activity-3", name: "Feria de ciencias", startDate: "2026-11-25", department: "Ciencias básicas", createdAt: "2026-02-12T09:00:00.000Z" },
];

function loadActivityOptions(): ActivityOption[] {
  if (typeof window === "undefined") return fallbackActivities;
  try {
    const stored = JSON.parse(window.localStorage.getItem(ACTIVITY_STORAGE_KEY) ?? "null") as Partial<ActivityOption>[] | null;
    return stored?.length ? stored.map((activity) => ({ id: activity.id || crypto.randomUUID(), name: activity.name || "Actividad sin nombre", startDate: activity.startDate || "", department: activity.department || "Sin dependencia", createdAt: activity.createdAt || "2026-11-20T12:00:00.000Z" })) : fallbackActivities;
  } catch {
    return fallbackActivities;
  }
}

function loadSnies(): SniesRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const records = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Partial<SniesRecord>[];
    return records.map((record) => ({ ...record, fileTitle: record.fileTitle || record.name || "SNIES sin título", activityId: record.activityId || "activity-1", activityCreatedAt: record.activityCreatedAt || "2026-06-15T09:00:00.000Z" })) as SniesRecord[];
  } catch {
    return [];
  }
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function availableDate(activity: ActivityOption) {
  return addMonths(new Date(activity.createdAt), 4);
}

function isEligible(activity: ActivityOption, today: Date | null) {
  return Boolean(today) && today! >= availableDate(activity);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function safeFileName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ") || "snies";
}

export default function SniesPage() {
  const [records, setRecords] = useState<SniesRecord[]>(loadSnies);
  const [activityOptions] = useState<ActivityOption[]>(loadActivityOptions);
  const [today, setToday] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() => loadSnies()[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [mode, setMode] = useState("propuesta");
  const [exportOpen, setExportOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createActivityId, setCreateActivityId] = useState("");
  const [createError, setCreateError] = useState("");

  const selected = records.find((record) => record.id === selectedId) ?? null;
  const filtered = useMemo(() => records.filter((record) =>
    (!search || `${record.fileTitle} ${record.name} ${record.code} ${record.department}`.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "Todos" || record.type === typeFilter) &&
    (!dateFilter || record.date === dateFilter)
  ), [records, search, typeFilter, dateFilter]);

  const selectedCreateActivity = activityOptions.find((activity) => activity.id === createActivityId);

  function persist(next: SniesRecord[]) {
    setRecords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function update(field: keyof SniesRecord, value: string) {
    if (!selected) return;
    persist(records.map((record) => record.id === selected.id ? { ...record, [field]: value, updatedAt: new Date().toISOString() } : record));
  }

  function openCreateDialog() {
    const currentDate = new Date();
    const availableActivities = activityOptions.filter((activity) => isEligible(activity, currentDate));
    setCreateTitle("");
    setCreateError("");
    setToday(currentDate);
    setCreateActivityId(availableActivities[0]?.id ?? activityOptions[0]?.id ?? "");
    setCreateOpen(true);
  }

  function createNew(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = createTitle.trim();
    const activity = activityOptions.find((item) => item.id === createActivityId);
    if (!title) { setCreateError("El título del archivo es obligatorio."); return; }
    if (!activity) { setCreateError("Selecciona una actividad de origen."); return; }
    if (!isEligible(activity, today)) { setCreateError(`Este registro estará disponible desde el ${formatDate(availableDate(activity))}.`); return; }

    const record: SniesRecord = {
      id: crypto.randomUUID(),
      code: `SNIES-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      fileTitle: title,
      activityId: activity.id,
      activityCreatedAt: activity.createdAt,
      name: activity.name,
      date: activity.startDate,
      place: "",
      department: activity.department,
      observations: "Datos precargados desde la actividad institucional.",
      type: "Capacitación",
      updatedAt: new Date().toISOString(),
      localSaved: false,
      uploaded: false,
    };
    persist([record, ...records]);
    setSelectedId(record.id);
    setCreateOpen(false);
  }

  function saveLocal() {
    if (!selected) return;
    persist(records.map((record) => record.id === selected.id ? { ...record, localSaved: true, updatedAt: new Date().toISOString() } : record));
    setExportOpen(true);
  }

  function sendReview() {
    if (!selected) return;
    if (!selected.fileTitle.trim()) { alert("Debes ingresar un título para el archivo antes de confirmarlo."); return; }
    persist(records.map((record) => record.id === selected.id ? { ...record, uploaded: true, localSaved: true, updatedAt: new Date().toISOString() } : record));
  }

  function deleteRecord() {
    if (!selected || !confirm("¿Eliminar este registro SNIES? Esta acción no se puede deshacer.")) return;
    const next = records.filter((record) => record.id !== selected.id);
    persist(next);
    setSelectedId(next[0]?.id ?? null);
  }

  async function exportFile(format: "pdf" | "docx") {
    if (!selected) return;
    const filename = safeFileName(selected.fileTitle);
    if (format === "docx") {
      const docx = await import("docx");
      const paragraph = (text: string) => new docx.Paragraph({ children: [new docx.TextRun(text)] });
      const document = new docx.Document({ sections: [{ children: [paragraph("CESMAG · REGISTRO SNIES"), paragraph(`Título: ${selected.fileTitle}`), paragraph(`Código: ${selected.code}`), paragraph(`Actividad: ${selected.name}`), paragraph(`Fecha: ${selected.date}`), paragraph(`Lugar: ${selected.place}`), paragraph(`Dependencia: ${selected.department}`), paragraph(`Observaciones: ${selected.observations}`)] }] });
      const blob = await docx.Packer.toBlob(document); const url = URL.createObjectURL(blob); const link = window.document.createElement("a"); link.href = url; link.download = `${filename}.docx`; link.click(); URL.revokeObjectURL(url);
    } else {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF(); pdf.setFontSize(16); pdf.text("CESMAG · REGISTRO SNIES", 20, 20); pdf.setFontSize(11); pdf.text([`Título: ${selected.fileTitle}`, `Código: ${selected.code}`, `Actividad: ${selected.name}`, `Fecha: ${selected.date}`, `Lugar: ${selected.place}`, `Dependencia: ${selected.department}`, `Observaciones: ${selected.observations}`], 20, 35, { maxWidth: 170 }); pdf.save(`${filename}.pdf`);
    }
    setExportOpen(false);
  }

  return (
    <div className="content">
      <div className="page-header"><div><div className="eyebrow">Registro asociado a la actividad</div><h1>Formato SNIES</h1></div><button className="primary" onClick={openCreateDialog}><FilePlus2 size={16} /> Crear nuevo archivo SNIES</button></div>
      <section className="card document-manager"><div className="document-toolbar"><input className="document-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, nombre, código o dependencia" /><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>Todos</option><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></div>{filtered.length === 0 ? <div className="document-empty">No hay registros SNIES que coincidan con los filtros.</div> : <div className="document-list">{filtered.map((record) => <button className={`document-row ${record.id === selectedId ? "active" : ""}`} key={record.id} onClick={() => setSelectedId(record.id)}><div><strong>{record.fileTitle}</strong><span>{record.name} · {record.code} · {record.type}</span></div><div className="document-statuses"><span className={record.localSaved ? "saved" : ""}>{record.localSaved ? "Versión guardada" : "Sin versión local"}</span><span className={record.uploaded ? "uploaded" : ""}>{record.uploaded ? "Confirmado" : "Sin confirmar"}</span></div></button>)}</div>}</section>

      {selected && <><div className="page-header document-actions"><div><div className="eyebrow">Archivo: {selected.fileTitle}</div><h2>{selected.code}</h2></div><div className="top-actions"><button className="secondary" onClick={saveLocal}><Save size={16} /> Guardar y continuar después</button><button className="secondary preview-toggle" onClick={() => setShowPreview((value) => !value)}>{showPreview ? <EyeOff size={16} /> : <Eye size={16} />} {showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}</button><button className="secondary danger" onClick={deleteRecord}><Trash2 size={16} /> Eliminar</button><button className="primary" onClick={sendReview}><Send size={16} /> Confirmar cambios</button></div></div>
        <div className={`workbench ${showPreview ? "" : "preview-hidden"}`}><section className="card form-panel"><div className="steps"><button className={`step ${activeStep === 0 ? "active" : ""}`} onClick={() => setActiveStep(0)}>Datos generales</button><button className={`step ${activeStep === 1 ? "active" : ""}`} onClick={() => setActiveStep(1)}>Actividad</button><button className={`step ${activeStep === 2 ? "active" : ""}`} onClick={() => setActiveStep(2)}>Participantes</button></div><div className="field-grid"><div className="field full"><label>Título del archivo <span className="required-mark">*</span></label><input value={selected.fileTitle} onChange={(event) => update("fileTitle", event.target.value)} /></div><div className="field"><label>Nombre de la actividad</label><input value={selected.name} onChange={(event) => update("name", event.target.value)} /></div><div className="field"><label>Fecha</label><input type="date" value={selected.date} onChange={(event) => update("date", event.target.value)} /></div><div className="field"><label>Lugar</label><input value={selected.place} onChange={(event) => update("place", event.target.value)} /></div><div className="field"><label>Dependencia</label><input value={selected.department} onChange={(event) => update("department", event.target.value)} /></div><div className="field"><label>Tipo de actividad</label><select value={selected.type} onChange={(event) => update("type", event.target.value)}><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select></div><div className="field full"><label>Observaciones</label><textarea value={selected.observations} onChange={(event) => update("observations", event.target.value)} /></div></div></section>
          {showPreview && <section className="preview"><div className="preview-toolbar"><div className="top-actions"><button className={`step ${mode === "actual" ? "active" : ""}`} onClick={() => setMode("actual")}>Actual</button><button className={`step ${mode === "propuesta" ? "active" : ""}`} onClick={() => setMode("propuesta")}>Propuesta</button><button className={`step ${mode === "comparar" ? "active" : ""}`} onClick={() => setMode("comparar")}>Comparar</button></div><button className="secondary" onClick={() => setExportOpen(true)}><Download size={15} /> Descargar</button></div><div className="sheet"><table><thead><tr><th>Campo institucional</th><th>Valor actual</th><th>{mode === "comparar" ? "Vista propuesta" : "Valor propuesto"}</th></tr></thead><tbody><tr><td>Título de archivo</td><td>Sin registrar</td><td className="changed">{selected.fileTitle}</td></tr><tr><td>Nombre de actividad</td><td>Sin registrar</td><td className="changed">{selected.name}</td></tr><tr><td>Fecha</td><td>Sin registrar</td><td className="changed">{selected.date}</td></tr><tr><td>Dependencia</td><td>Sin registrar</td><td className="changed">{selected.department}</td></tr></tbody></table></div></section>}
        </div></>}

      {createOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><section className="system-dialog create-file-dialog snies-create-dialog" role="dialog" aria-modal="true" aria-labelledby="create-snies-title"><button className="dialog-close" type="button" aria-label="Cerrar" onClick={() => setCreateOpen(false)}><X size={18} /></button><div className="dialog-icon"><FileSpreadsheet size={21} /></div><h2 id="create-snies-title">Crear archivo SNIES</h2><p>El archivo SNIES debe tener un título y estar asociado a una actividad creada hace mínimo cuatro meses.</p><form onSubmit={createNew}><div className="field"><label htmlFor="snies-file-title">Título del archivo <span className="required-mark">*</span></label><input id="snies-file-title" value={createTitle} onChange={(event) => { setCreateTitle(event.target.value); setCreateError(""); }} placeholder="Ej. SNIES jornada docente 2026" required autoFocus /></div><div className="field"><label htmlFor="snies-activity">Actividad de origen <span className="required-mark">*</span></label><select id="snies-activity" value={createActivityId} onChange={(event) => { setCreateActivityId(event.target.value); setCreateError(""); }}>{activityOptions.map((activity) => <option key={activity.id} value={activity.id} disabled={!isEligible(activity, today)}>{activity.name} · creada {formatDate(new Date(activity.createdAt))}{isEligible(activity, today) ? "" : ` · disponible ${formatDate(availableDate(activity))}`}</option>)}</select></div>{selectedCreateActivity && <div className={`eligibility-note ${isEligible(selectedCreateActivity, today) ? "eligible" : "blocked"}`}>{isEligible(selectedCreateActivity, today) ? <><CalendarClock size={17} /><span>Actividad habilitada para SNIES.</span></> : <><AlertTriangle size={17} /><span>Este registro no puede crearse todavía. Estará disponible el <strong>{formatDate(availableDate(selectedCreateActivity))}</strong>.</span></>}</div>}{!activityOptions.length && <div className="eligibility-note blocked"><AlertTriangle size={17} /><span>No hay actividades disponibles para asociar.</span></div>}{createError && <small className="field-error create-error">{createError}</small>}<div className="dialog-actions"><button className="secondary" type="button" onClick={() => setCreateOpen(false)}>Cancelar</button><button className="primary" type="submit" disabled={!selectedCreateActivity || !isEligible(selectedCreateActivity, today)}>Crear archivo SNIES</button></div></form></section></div>}
      {exportOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setExportOpen(false); }}><section className="system-dialog export-dialog"><h2>Descargar borrador SNIES</h2><p>El archivo se guarda únicamente en este equipo y no será visible para jefatura ni agregado al SNIES.</p><div className="export-options"><button className="secondary" onClick={() => exportFile("docx")}>Documento DOCX</button><button className="primary" onClick={() => exportFile("pdf")}>Documento PDF</button></div></section></div>}
    </div>
  );
}
