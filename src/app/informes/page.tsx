"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Download, Save, Send } from "lucide-react";

export default function ReportsPage() {
  const [objectives, setObjectives] = useState("Fortalecer las competencias docentes mediante una jornada de capacitación institucional.");
  const steps = ["Información general","Responsable","Descripción","Objetivos","Desarrollo","Resultados","Conclusiones","Recomendaciones","Evidencias","Revisión"];
  return (
    <AppShell>
      <div className="content">
        <div className="page-header">
          <div><div className="eyebrow">Actividad: Jornada de capacitación docente</div><h1>Informe de actividades</h1></div>
          <div className="top-actions"><button className="secondary"><Save size={16}/> Guardar borrador</button><button className="primary"><Send size={16}/> Enviar a revisión</button></div>
        </div>
        <div className="workbench">
          <section className="card form-panel">
            <div className="steps">{steps.map((step,i)=><button className={`step ${i===3?"active":""}`} key={step}>{i+1}. {step}</button>)}</div>
            <div className="field-grid">
              <div className="field"><label>Nombre de la actividad</label><input defaultValue="Jornada de capacitación docente" /></div>
              <div className="field"><label>Código del informe</label><input defaultValue="INF-2026-024" /></div>
              <div className="field"><label>Responsable</label><input defaultValue="Ana Rodríguez" /></div>
              <div className="field"><label>Dependencia</label><input defaultValue="Vicerrectoría académica" /></div>
              <div className="field full"><label>Objetivos</label><textarea value={objectives} onChange={(event)=>setObjectives(event.target.value)} /></div>
              <div className="field"><label>Fecha de inicio</label><input type="date" defaultValue="2026-11-18" /></div>
              <div className="field"><label>Fecha de finalización</label><input type="date" defaultValue="2026-11-18" /></div>
            </div>
          </section>
          <section className="preview">
            <div className="preview-toolbar"><strong>Vista previa · A4</strong><button className="secondary"><Download size={15}/> PDF</button></div>
            <article className="a4">
              <div style={{textAlign:"center",fontWeight:"bold",color:"#214C91"}}>CESMAG · SISTEMA INSTITUCIONAL</div>
              <h2>INFORME DE ACTIVIDAD</h2>
              <h3>1. Información general</h3>
              <p><strong>Actividad:</strong> Jornada de capacitación docente<br/><strong>Código:</strong> INF-2026-024<br/><strong>Responsable:</strong> Ana Rodríguez<br/><strong>Dependencia:</strong> Vicerrectoría académica</p>
              <h3>2. Objetivos</h3>
              <p>{objectives}</p>
              <h3>3. Desarrollo</h3>
              <p>La actividad se desarrolló conforme a la programación institucional aprobada.</p>
              <h3>4. Evidencias</h3>
              <p>Las evidencias adjuntas se relacionan con la actividad y se almacenan como documentos asociados.</p>
            </article>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
