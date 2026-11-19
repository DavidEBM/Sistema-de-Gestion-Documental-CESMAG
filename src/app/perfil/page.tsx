import { AppShell } from "@/components/layout/AppShell";
import { Save } from "lucide-react";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="content">
        <div className="page-header"><div><div className="eyebrow">Información institucional</div><h1>Mi perfil</h1></div><button className="primary"><Save size={16}/> Guardar cambios</button></div>
        <div className="grid-2">
          <section className="card form-panel">
            <h2>Datos editables</h2>
            <div className="field-grid">
              <div className="field"><label>Teléfono</label><input defaultValue="+57 300 123 4567"/></div>
              <div className="field"><label>EPS</label><input defaultValue="EPS institucional"/></div>
              <div className="field full"><label>Dirección</label><input defaultValue="San Juan de Pasto, Colombia"/></div>
            </div>
          </section>
          <section className="card panel">
            <h2>Datos protegidos</h2>
            <table className="table"><tbody>
              <tr><td>Nombre</td><td><strong>Ana Rodríguez</strong></td></tr>
              <tr><td>Correo</td><td>ana.rodriguez@cesmag.edu.co</td></tr>
              <tr><td>Cargo</td><td>Coordinadora académica</td></tr>
              <tr><td>Rol de seguridad</td><td>Administrador</td></tr>
              <tr><td>Dependencia</td><td>Vicerrectoría académica</td></tr>
              <tr><td>Estado</td><td><span className="status">Activo</span></td></tr>
            </tbody></table>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
