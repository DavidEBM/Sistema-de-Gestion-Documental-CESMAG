import Link from "next/link";
import { BriefcaseBusiness, ShieldCheck, Workflow } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="hero-brand"><div className="brand-mark">CES</div><span>CESMAG</span></div>
        <div className="hero-copy">
          <h2>Gestión documental institucional</h2>
          <p>Centralice actividades, informes y registros institucionales en una plataforma segura y trazable.</p>
          <div className="features">
            <div className="feature"><div className="feature-icon"><BriefcaseBusiness size={18} /></div>Fortalecimiento institucional</div>
            <div className="feature"><div className="feature-icon"><Workflow size={18} /></div>Gestión documental eficiente</div>
            <div className="feature"><div className="feature-icon"><ShieldCheck size={18} /></div>Mejoramiento continuo</div>
          </div>
        </div>
        <div className="hero-footer">Institución de Educación Superior · Colombia</div>
      </section>
      <section className="login-content">
        <div className="login-card">
          <h1>Ingreso al sistema</h1>
          <p>Utilice su cuenta institucional autorizada para acceder al Sistema de Gestión Documental.</p>
          <div className="protected"><ShieldCheck size={14} /> Acceso protegido</div>
          <Link className="google" href="/dashboard" aria-label="Continuar con Google">
            <span aria-hidden="true">G</span>
            Continuar con Google
          </Link>
          <div className="login-foot">Uso exclusivo para personal autorizado por la institución</div>
        </div>
      </section>
    </main>
  );
}
