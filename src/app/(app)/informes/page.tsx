"use client";

import { useMemo, useState } from "react";
import { Download, Eye, EyeOff, FilePlus2, Save, Send, Trash2 } from "lucide-react";

type ReportRecord = {
  id: string; code: string; name: string; responsible: string; department: string;
  objectives: string; startDate: string; endDate: string; type: string;
  updatedAt: string; localSaved: boolean; uploaded: boolean;
};

const STORAGE_KEY = "cesmag-local-reports";
const blank = (): ReportRecord => ({ id: crypto.randomUUID(), code: `INF-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`, name: "Jornada de capacitación docente", responsible: "Ana Rodríguez", department: "Vicerrectoría académica", objectives: "Fortalecer las competencias docentes mediante una jornada de capacitación institucional.", startDate: "2026-11-18", endDate: "2026-11-18", type: "Capacitación", updatedAt: new Date().toISOString(), localSaved: false, uploaded: false });
function loadReports(): ReportRecord[] { if (typeof window === "undefined") return []; try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as ReportRecord[]; } catch { return []; } }

export default function ReportsPage() {
  const [records, setRecords] = useState<ReportRecord[]>(loadReports);
  const [selectedId, setSelectedId] = useState<string | null>(() => loadReports()[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [activeStep, setActiveStep] = useState(3);
  const [exportOpen, setExportOpen] = useState(false);
  const steps = ["Información general","Responsable","Descripción","Objetivos","Desarrollo","Resultados","Conclusiones","Recomendaciones","Evidencias","Revisión"];

  const selected = records.find((record) => record.id === selectedId) ?? null;
  const filtered = useMemo(() => records.filter((record) =>
    (!search || `${record.name} ${record.code} ${record.responsible}`.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "Todos" || record.type === typeFilter) &&
    (!dateFilter || record.startDate === dateFilter || record.endDate === dateFilter)
  ), [records, search, typeFilter, dateFilter]);

  function persist(next: ReportRecord[]) { setRecords(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
  function update(field: keyof ReportRecord, value: string) { if (!selected) return; persist(records.map((record) => record.id === selected.id ? { ...record, [field]: value, updatedAt: new Date().toISOString() } : record)); }
  function createNew() { const record = blank(); persist([record, ...records]); setSelectedId(record.id); }
  function saveLocal() { if (!selected) return; persist(records.map((record) => record.id === selected.id ? { ...record, localSaved: true, updatedAt: new Date().toISOString() } : record)); setExportOpen(true); }
  async function sendReview() {
    if (!selected) return;
    const payload = `CESMAG - INFORME\nCódigo: ${selected.code}\nActividad: ${selected.name}\nResponsable: ${selected.responsible}\nDependencia: ${selected.department}\nObjetivos: ${selected.objectives}`;
    try {
      const response = await fetch("/api/drive/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `${selected.code}.txt`, mimeType: "text/plain", contentBase64: btoa(unescape(encodeURIComponent(payload))), subfolder: `Informes/${selected.department}` }) });
      if (!response.ok) throw new Error("Drive unavailable");
      persist(records.map((record) => record.id === selected.id ? { ...record, uploaded: true, localSaved: true, updatedAt: new Date().toISOString() } : record));
    } catch {
      alert("No fue posible subir a Drive. El informe sigue guardado como borrador local.");
    }
  }
  function deleteRecord() { if (!selected || !confirm("¿Eliminar este informe? Esta acción no se puede deshacer.")) return; const next = records.filter((record) => record.id !== selected.id); persist(next); setSelectedId(next[0]?.id ?? null); }

  async function exportFile(format: "pdf" | "docx") {
    if (!selected) return;
    if (format === "docx") {
      const docx = await import("docx");
      const paragraph = (text: string) => new docx.Paragraph({ children: [new docx.TextRun(text)] });
      const document = new docx.Document({ sections: [{ children: [paragraph("CESMAG · SISTEMA INSTITUCIONAL"), paragraph("INFORME DE ACTIVIDAD"), paragraph(`Actividad: ${selected.name}`), paragraph(`Código: ${selected.code}`), paragraph(`Responsable: ${selected.responsible}`), paragraph(`Dependencia: ${selected.department}`), paragraph(`Objetivos: ${selected.objectives}`)] }] });
      const blob = await docx.Packer.toBlob(document);
      const url = URL.createObjectURL(blob); const link = documentLink(url, `${selected.code}.docx`); link.click(); URL.revokeObjectURL(url);
    } else {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF(); pdf.setFontSize(16); pdf.text("CESMAG · INFORME DE ACTIVIDAD", 20, 20); pdf.setFontSize(11); pdf.text([`Actividad: ${selected.name}`, `Código: ${selected.code}`, `Responsable: ${selected.responsible}`, `Dependencia: ${selected.department}`, `Objetivos: ${selected.objectives}`], 20, 35, { maxWidth: 170 }); pdf.save(`${selected.code}.pdf`);
    }
    setExportOpen(false);
  }

  function documentLink(url: string, name: string) { const link = window.document.createElement("a"); link.href = url; link.download = name; return link; }

  return (
    <div className="content">
      <div className="page-header"><div><div className="eyebrow">Gestión documental</div><h1>Informes de actividades</h1></div><button className="primary" onClick={createNew}><FilePlus2 size={16}/> Crear nuevo informe</button></div>
      <section className="card document-manager">
        <div className="document-toolbar">
          <input className="document-search" value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Buscar por nombre, código o responsable" />
          <select value={typeFilter} onChange={(event)=>setTypeFilter(event.target.value)}><option>Todos</option><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select>
          <input type="date" value={dateFilter} onChange={(event)=>setDateFilter(event.target.value)} />
        </div>
        {filtered.length === 0 ? <div className="document-empty">No hay informes que coincidan con los filtros.</div> : <div className="document-list">{filtered.map((record)=><button className={`document-row ${record.id===selectedId?"active":""}`} key={record.id} onClick={()=>setSelectedId(record.id)}>
          <div><strong>{record.name}</strong><span>{record.code} · {record.type}</span></div>
          <div className="document-statuses"><span className={record.localSaved?"saved":""}>{record.localSaved?"Versión guardada":"Sin versión local"}</span><span className={record.uploaded?"uploaded":""}>{record.uploaded?"Enviada":"No subida"}</span></div>
        </button>)}</div>}
      </section>

      {selected && <>
        <div className="page-header document-actions"><div><div className="eyebrow">Actividad: {selected.name}</div><h2>{selected.code}</h2></div><div className="top-actions"><button className="secondary" onClick={saveLocal}><Save size={16}/> Guardar y continuar después</button><button className="secondary preview-toggle" onClick={()=>setShowPreview((visible)=>!visible)}>{showPreview?<EyeOff size={16}/>:<Eye size={16}/>} {showPreview?"Ocultar vista previa":"Mostrar vista previa"}</button><button className="secondary danger" onClick={deleteRecord}><Trash2 size={16}/> Eliminar</button><button className="primary" onClick={sendReview}><Send size={16}/> Enviar a revisión</button></div></div>
        <div className={`workbench ${showPreview?"":"preview-hidden"}`}>
          <section className="card form-panel"><div className="steps">{steps.map((step,i)=><button className={`step ${i===activeStep?"active":""}`} key={step} onClick={()=>setActiveStep(i)}>{i+1}. {step}</button>)}</div><div className="field-grid">
            <div className="field"><label>Nombre de la actividad</label><input value={selected.name} onChange={(event)=>update("name",event.target.value)} /></div><div className="field"><label>Código del informe</label><input value={selected.code} onChange={(event)=>update("code",event.target.value)} /></div>
            <div className="field"><label>Responsable</label><input value={selected.responsible} onChange={(event)=>update("responsible",event.target.value)} /></div><div className="field"><label>Dependencia</label><input value={selected.department} onChange={(event)=>update("department",event.target.value)} /></div>
            <div className="field"><label>Tipo de actividad</label><select value={selected.type} onChange={(event)=>update("type",event.target.value)}><option>Capacitación</option><option>Investigación</option><option>Extensión</option><option>Administrativa</option></select></div><div className="field" />
            <div className="field full"><label>Objetivos</label><textarea value={selected.objectives} onChange={(event)=>update("objectives",event.target.value)} /></div>
            <div className="field"><label>Fecha de inicio</label><input type="date" value={selected.startDate} onChange={(event)=>update("startDate",event.target.value)} /></div><div className="field"><label>Fecha de finalización</label><input type="date" value={selected.endDate} onChange={(event)=>update("endDate",event.target.value)} /></div>
          </div></section>
          {showPreview && <section className="preview"><div className="preview-toolbar"><strong>Vista previa · A4</strong><button className="secondary" onClick={()=>setExportOpen(true)}><Download size={15}/> Descargar</button></div><article className="a4"><div style={{textAlign:"center",fontWeight:"bold",color:"#214C91"}}>CESMAG · SISTEMA INSTITUCIONAL</div><h2>INFORME DE ACTIVIDAD</h2><h3>1. Información general</h3><p><strong>Actividad:</strong> {selected.name}<br/><strong>Código:</strong> {selected.code}<br/><strong>Responsable:</strong> {selected.responsible}<br/><strong>Dependencia:</strong> {selected.department}</p><h3>2. Objetivos</h3><p>{selected.objectives}</p><h3>3. Desarrollo</h3><p>La actividad se desarrolló conforme a la programación institucional aprobada.</p></article></section>}
        </div>
      </>}
      {exportOpen && <div className="dialog-backdrop" onMouseDown={(event)=>{if(event.target===event.currentTarget)setExportOpen(false)}}><section className="system-dialog export-dialog"><h2>Descargar borrador</h2><p>El archivo se guarda únicamente en este equipo y no será visible para jefatura ni agregado al SNIES.</p><div className="export-options"><button className="secondary" onClick={()=>exportFile("docx")}>Documento DOCX</button><button className="primary" onClick={()=>exportFile("pdf")}>Documento PDF</button></div></section></div>}
    </div>
  );
}
