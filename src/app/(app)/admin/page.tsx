import { Plus } from "lucide-react";

export default function AdminPage() {
  return (

      <div className="content">
        <div className="page-header"><div><div className="eyebrow">Configuración institucional</div><h1>Administración</h1></div><button className="primary"><Plus size={16}/> Registrar usuario</button></div>
        <section className="cards">
          {[["Usuarios","48"],["Dependencias","12"],["Plantillas","6"],["Formatos SNIES","2"]].map(([title,value])=><article className="card stat" key={title}><div className="stat-head"><span>{title}</span></div><strong>{value}</strong></article>)}
        </section>
        <section className="card panel" style={{marginTop:16}}>
          <h2>Usuarios institucionales</h2>
          <table className="table"><thead><tr><th>Usuario</th><th>Dependencia</th><th>Rol</th><th>Estado</th></tr></thead><tbody>
            <tr><td>Ana Rodríguez</td><td>Vicerrectoría académica</td><td>Administrador</td><td><span className="status">Activo</span></td></tr>
            <tr><td>Carlos Méndez</td><td>Investigación</td><td>Coordinador</td><td><span className="status">Activo</span></td></tr>
            <tr><td>Laura Pérez</td><td>Ciencias básicas</td><td>Usuario institucional</td><td><span className="status pending">Suspendido</span></td></tr>
          </tbody></table>
        </section>
      </div>

  );
}
