import { Plus, Search } from "lucide-react";

export default function ActivitiesPage() {
  return (

      <div className="content">
        <div className="page-header">
          <div><div className="eyebrow">Gestión institucional</div><h1>Actividades</h1></div>
          <button className="primary"><Plus size={17} /> Crear actividad</button>
        </div>
        <section className="card panel">
          <div className="top-actions" style={{justifyContent:"space-between", marginBottom:14}}>
            <div className="search"><Search size={16}/><input placeholder="Buscar actividad" /></div>
            <select aria-label="Filtrar estado" style={{height:40,border:"1px solid #dbe4ef",borderRadius:9,padding:"0 10px"}}><option>Todas</option><option>Borrador</option><option>En revisión</option><option>Aprobadas</option></select>
          </div>
          <table className="table">
            <thead><tr><th>Actividad</th><th>Responsable</th><th>Fecha</th><th>Dependencia</th><th>Estado</th></tr></thead>
            <tbody>
              {[
                ["Jornada de capacitación docente","Ana Rodríguez","18 nov 2026","Vicerrectoría académica","Aprobado",""],
                ["Encuentro de investigación","Carlos Méndez","21 nov 2026","Investigación","En revisión","review"],
                ["Feria de ciencias","Laura Pérez","25 nov 2026","Ciencias básicas","Borrador","pending"],
              ].map((row) => <tr key={row[0]}>{row.slice(0,5).map((cell,i)=><td key={i}>{i===4?<span className={`status ${row[5]}`}>{cell}</span>:cell}</td>)}</tr>)}
            </tbody>
          </table>
        </section>
      </div>

  );
}
