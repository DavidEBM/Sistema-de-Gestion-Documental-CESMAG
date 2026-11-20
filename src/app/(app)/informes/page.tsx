"use client";

import { useMemo, useState } from "react";
import { Download, Eye, EyeOff, FilePlus2, Save, Send, Trash2, X } from "lucide-react";

type ReportRecord = {
  id: string;
  code: string;
  fileTitle: string;
  name: string;
  responsible: string;
  department: string;
  objectives: string;
  startDate: string;
  endDate: string;
  type: string;
  updatedAt: string;
  localSaved: boolean;
  uploaded: boolean;
};

const STORAGE_KEY = "cesmag-local-reports";

const blank = (fileTitle: string): ReportRecord => ({
  id: crypto.randomUUID(),
  code: `INF-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  fileTitle,
  name: "Jornada de capacitación docente",
  responsible: "Ana Rodríguez",
  department: "Vicerrectoría académica",
  objectives: "Fortalecer las competencias docentes mediante una jornada de capacitación institucional.",
  startDate: "2026-11-18",
  endDate: "2026-11-18",
  type: "Capacitación",
  updatedAt: new Date().toISOString(),
  localSaved: false,
  uploaded: false,
});

function loadReports(): ReportRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const records = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Partial<ReportRecord>[];
    return records.map((record) => ({ ...record, fileTitle: record.fileTitle || record.name || "Informe sin título" })) as ReportRecord[];
  } catch {
    return [];
  }
}

function safeFileName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ") || "informe";
}

export default function ReportsPage() {
  const [records, setRecords] = useState<ReportRecord[]>(loadReports);
  const [selectedId, setSelectedId] = useState<string | null>(() => loadReports()[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [activeStep, setActiveStep] = useState(3);
  const [exportOpen, setExportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createError, setCreateError] = useState("");
  const steps = ["Información general", "Responsable", "Descripción", "Objetivos", "Desarrollo", "Resultados", "Conclusiones", "Recomendaciones", "Evidencias", "Revisión"];

  const selected = records.find((record) => record.id === selectedId) ?? null;
  const filtered = useMemo(() => records.filter((record) =>
    (!search || `${record.fileTitle} ${record.name} ${record.code} ${record.responsible}`.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "Todos" || record.type === typeFilter) &&
    (!dateFilter || record.startDate === dateFilter || record.endDate === dateFilter)
  ), [records, search, typeFilter, dateFilter]);

  function persist(next: ReportRecord[]) {
    setRecords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function update(field: keyof ReportRecord, value: string) {
    if (!selected) return;
    persist(records.map((record) => record.id === selected.id ? { ...record, [field]: value, updatedAt: new Date().toISOString() } : record));
  }

  function openCreateDialog() {
    setCreateTitle("");
    setCreateError("");
    setCreateOpen(true);
  }

  function createNew(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = createTitle.trim();
    if (!title) {
      setCreateError("El título del archivo es obligatorio.");
      return;
    }
    const record = blank(title);
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
    if (!selected.fileTitle.trim()) { alert("Debes ingresar un título para el archivo antes de enviarlo."); return; }
    persist(records.map((record) => record.id === selected.id ? { ...record, uploaded: true, localSaved: true, updatedAt: new Date().toISOString() } : record));
  }

  function deleteRecord() {
    if (!selected || !confirm("¿Eliminar este informe? Esta acción no se puede deshacer.")) return;
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
      const document = new docx.Document({ sections: [{ children: [paragraph("CESMAG · SISTEMA INSTITUCIONAL"), paragraph("INFORME DE ACTIVIDAD"), paragraph(`Título: ${selected.fileTitle}`), paragraph(`Actividad: ${selected.name}`), paragraph(`Código: ${selected.code}`), paragraph(`Responsable: ${selected.responsible}`), paragraph(`Dependencia: ${selected.department}`), paragraph(`Objetivos: ${selected.objectives}`)] }] });
      const blob = await docx.Packer.toBlob(document);
      const url = URL.createObjectURL(blob); const link = documentLink(url, `${filename}.docx`); link.click(); URL.revokeObjectURL(url);
    } else {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF(); pdf.setFontSize(16); pdf.text("CESMAG · INFORME DE ACTIVIDAD", 20, 20); pdf.setFontSize(11); pdf.text([`Título: ${selected.fileTitle}`, `Actividad: ${selected.name}`, `Código: ${selected.code}`, `Responsable: ${selected.responsible}`, `Dependencia: ${selected.department}`, `Objetivos: ${selected.objectives}`], 20, 35, { maxWidth: 170 }); pdf.save(`${filename}.pdf`);
    }
    setExportOpen(false);
  }

  function documentLink(url: string, name: string) { const link = window.document.createElement("a"); link.href = url; link.download = name; return link; }

  return (
    <div className="content">
      <div className="page-header"><div><div className="eyebrow">Gestión documental</div><h1>Informes de actividades</h1></div><button className="primary" onClick={openCreateDialog}><FilePlus2 size={16} /> Crear nuevo informe</button></div>
      <section className="card document-manager">
        <div className="document-toolbar"><input className="document-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, nombre, código o responsable" /><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>Todos</option><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></div>
        {filtered.length === 0 ? <div className="document-empty">No hay informes que coincidan con los filtros.</div> : <div className="document-list">{filtered.map((record) => <button className={`document-row ${record.id === selectedId ? "active" : ""}`} key={record.id} onClick={() => setSelectedId(record.id)}><div><strong>{record.fileTitle}</strong><span>{record.name} · {record.code} · {record.type}</span></div><div className="document-statuses"><span className={record.localSaved ? "saved" : ""}>{record.localSaved ? "Versión guardada" : "Sin versión local"}</span><span className={record.uploaded ? "uploaded" : ""}>{record.uploaded ? "Confirmada" : "Sin confirmar"}</span></div></button>)}</div>}
      </section>

      {selected && <>
        <div className="page-header document-actions"><div><div className="eyebrow">Archivo: {selected.fileTitle}</div><h2>{selected.code}</h2></div><div className="top-actions"><button className="secondary" onClick={saveLocal}><Save size={16} /> Guardar y continuar después</button><button className="secondary preview-toggle" onClick={() => setShowPreview((visible) => !visible)}>{showPreview ? <EyeOff size={16} /> : <Eye size={16} />} {showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}</button><button className="secondary danger" onClick={deleteRecord}><Trash2 size={16} /> Eliminar</button><button className="primary" onClick={sendReview}><Send size={16} /> Confirmar demostración</button></div></div>
        <div className={`workbench ${showPreview ? "" : "preview-hidden"}`}>
          <section className="card form-panel"><div className="steps">{steps.map((step, i) => <button className={`step ${i === activeStep ? "active" : ""}`} key={step} onClick={() => setActiveStep(i)}>{i + 1}. {step}</button>)}</div><div className="field-grid">
            <div className="field full"><label>Título del archivo <span className="required-mark">*</span></label><input value={selected.fileTitle} onChange={(event) => update("fileTitle", event.target.value)} /></div>
            <div className="field"><label>Nombre de la actividad</label><input value={selected.name} onChange={(event) => update("name", event.target.value)} /></div><div className="field"><label>Código del informe</label><input value={selected.code} onChange={(event) => update("code", event.target.value)} /></div>
            <div className="field"><label>Responsable</label><input value={selected.responsible} onChange={(event) => update("responsible", event.target.value)} /></div><div className="field"><label>Dependencia</label><input value={selected.department} onChange={(event) => update("department", event.target.value)} /></div>
            <div className="field"><label>Tipo de actividad</label><select value={selected.type} onChange={(event) => update("type", event.target.value)}><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select></div><div className="field" />
            <div className="field full"><label>Objetivos</label><textarea value={selected.objectives} onChange={(event) => update("objectives", event.target.value)} /></div>
            <div className="field"><label>Fecha de inicio</label><input type="date" value={selected.startDate} onChange={(event) => update("startDate", event.target.value)} /></div><div className="field"><label>Fecha de finalización</label><input type="date" value={selected.endDate} onChange={(event) => update("endDate", event.target.value)} /></div>
          </div></section>
          {showPreview && <section className="preview"><div className="preview-toolbar"><strong>Vista previa · A4</strong><button className="secondary" onClick={() => setExportOpen(true)}><Download size={15} /> Descargar</button></div><article className="a4"><div style={{ textAlign: "center", fontWeight: "bold", color: "#214C91" }}>CESMAG · SISTEMA INSTITUCIONAL</div><h2>{selected.fileTitle}</h2><h3>1. Información general</h3><p><strong>Actividad:</strong> {selected.name}<br /><strong>Código:</strong> {selected.code}<br /><strong>Responsable:</strong> {selected.responsible}<br /><strong>Dependencia:</strong> {selected.department}</p><h3>2. Objetivos</h3><p>{selected.objectives}</p><h3>3. Desarrollo</h3><p>La actividad se desarrolló conforme a la programación institucional aprobada.</p></article></section>}
        </div>
      </>}

      {createOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><section className="system-dialog create-file-dialog" role="dialog" aria-modal="true" aria-labelledby="create-report-title"><button className="dialog-close" type="button" aria-label="Cerrar" onClick={() => setCreateOpen(false)}><X size={18} /></button><div className="dialog-icon"><FilePlus2 size={21} /></div><h2 id="create-report-title">Crear nuevo informe</h2><p>Antes de abrir el formulario, asigna el título con el que se guardará y se identificará el archivo.</p><form onSubmit={createNew}><div className="field"><label htmlFor="report-file-title">Título del archivo <span className="required-mark">*</span></label><input id="report-file-title" value={createTitle} onChange={(event) => { setCreateTitle(event.target.value); setCreateError(""); }} placeholder="Ej. Informe jornada docente 2026" autoFocus required />{createError && <small className="field-error">{createError}</small>}</div><div className="dialog-actions"><button className="secondary" type="button" onClick={() => setCreateOpen(false)}>Cancelar</button><button className="primary" type="submit">Continuar</button></div></form></section></div>}
      {exportOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setExportOpen(false); }}><section className="system-dialog export-dialog"><h2>Descargar borrador</h2><p>El archivo se guarda únicamente en este equipo y no será visible para jefatura ni agregado al SNIES.</p><div className="export-options"><button className="secondary" onClick={() => exportFile("docx")}>Documento DOCX</button><button className="primary" onClick={() => exportFile("pdf")}>Documento PDF</button></div></section></div>}
    </div>
  );
}
