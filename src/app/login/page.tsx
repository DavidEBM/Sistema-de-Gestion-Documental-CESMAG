"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, ShieldCheck, Workflow } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="hero-brand">
          <Image className="hero-logo" src="/logo/logo_color_unicesmag.png" alt="CESMAG" width={48} height={48} priority />
          <span>CESMAG</span>
        </div>
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
          <p>Explore el prototipo del Sistema de Gestión Documental en modo demostración.</p>
          <div className="protected"><ShieldCheck size={14} /> Demostración local</div>
          <button className="google" type="button" aria-label="Ingresar al sistema" onClick={() => router.push("/dashboard")}>
            Ingresar al sistema
          </button>
          <div className="login-foot">Los cambios se conservan únicamente en este navegador</div>
        </div>
      </section>
    </main>
  );
}
