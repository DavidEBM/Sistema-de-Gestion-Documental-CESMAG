"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Check, Download } from "lucide-react";

export default function SniesPage() {
  const [mode,setMode] = useState("propuesta");
  return (
    <AppShell>
      <div className="content">
        <div className="page-header">
          <div><div className="eyebrow">Registro asociado a la actividad</div><h1>Formato SNIES</h1></div>
          <button className="primary"><Check size={16}/> Confirmar cambios</button>
        </div>
        <div className="workbench">
          <section className="card form-panel">
            <div className="steps"><button className="step active">Datos generales</button><button className="step">Actividad</button><button className="step">Participantes</button></div>
            <div className="field-grid">
              <div className="field"><label>Nombre de la actividad</label><input defaultValue="Jornada de capacitación docente" /></div>
              <div className="field"><label>Fecha</label><input type="date" defaultValue="2026-11-18" /></div>
              <div className="field"><label>Lugar</label><input defaultValue="CESMAG" /></div>
              <div className="field"><label>Dependencia</label><input defaultValue="Vicerrectoría académica" /></div>
              <div className="field full"><label>Observaciones</label><textarea defaultValue="Datos precargados desde la actividad institucional." /></div>
            </div>
          </section>
          <section className="preview">
            <div className="preview-toolbar">
              <div className="top-actions"><button className="step" onClick={()=>setMode("actual")}>Actual</button><button className="step active" onClick={()=>setMode("propuesta")}>Propuesta</button><button className="step" onClick={()=>setMode("comparar")}>Comparar</button></div>
              <button className="secondary"><Download size={15}/> Exportar Excel</button>
            </div>
            <div className="sheet">
              <table><thead><tr><th>Campo institucional</th><th>Valor actual</th><th>{mode==="comparar"?"Vista propuesta":"Valor propuesto"}</th></tr></thead><tbody>
                <tr><td>Nombre de actividad</td><td>Sin registrar</td><td className="changed">Jornada de capacitación docente</td></tr>
                <tr><td>Fecha</td><td>Sin registrar</td><td className="changed">18/11/2026</td></tr>
                <tr><td>Dependencia</td><td>Sin registrar</td><td className="changed">Vicerrectoría académica</td></tr>
              </tbody></table>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
