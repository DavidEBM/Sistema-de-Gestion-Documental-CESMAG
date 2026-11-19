import { AppShell } from "@/components/layout/AppShell";
import { Activity, CheckCircle2, Clock3, FileText, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="content">
        <div className="page-header">
          <div><div className="eyebrow">Miércoles, 19 de noviembre de 2026</div><h1>Buenos días, Ana</h1></div>
          <a className="primary" href="/actividades"><Plus size={17} /> Nueva actividad</a>
        </div>
        <section className="cards">
          {[
            ["Actividades", "24", Activity],
            ["Informes pendientes", "5", Clock3],
            ["Informes aprobados", "18", CheckCircle2],
            ["SNIES pendientes", "3", FileText],
          ].map(([title, value, Icon]) => (
            <article className="card stat" key={String(title)}>
              <div className="stat-head"><span>{String(title)}</span><div className="stat-icon"><Icon size={18} /></div></div>
              <strong>{String(value)}</strong>
            </article>
          ))}
        </section>
        <div className="grid-2">
          <section className="card panel">
            <h2>Actividades recientes</h2>
            {[
              ["Jornada de capacitación docente", "18 nov", "Aprobado", ""],
              ["Encuentro de investigación", "21 nov", "En revisión", "review"],
              ["Feria de ciencias", "25 nov", "Borrador", "pending"],
            ].map(([name, date, state, type]) => (
              <div className="activity-row" key={name}>
                <div className="date-box"><div><strong>{date.split(" ")[0]}</strong>{date.split(" ")[1]}</div></div>
                <div><strong>{name}</strong><div className="eyebrow">Vicerrectoría académica</div></div>
                <span className={`status ${type}`}>{state}</span>
              </div>
            ))}
          </section>
          <section className="card panel">
            <h2>Documentos recientes</h2>
            {["Informe jornada docente", "Reporte SNIES 2026", "Certificado capacitación"].map((item) => (
              <div className="activity-row" key={item}>
                <div className="stat-icon"><FileText size={17} /></div>
                <div><strong>{item}</strong><div className="eyebrow">Actualizado hoy</div></div>
                <span className="status">Sincronizado</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
