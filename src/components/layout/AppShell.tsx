"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  UserRound,
  CalendarCheck,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/actividades", label: "Actividades", icon: CalendarCheck },
  { href: "/informes", label: "Informes", icon: FileText },
  { href: "/snies", label: "SNIES", icon: FileSpreadsheet },
  { href: "/perfil", label: "Mi perfil", icon: UserRound },
  { href: "/admin", label: "Administración", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CES</div>
          <div className="brand-name">Gestión Documental Institucional</div>
        </div>
        <nav className="nav" aria-label="Navegación principal">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href} title={label}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">CESMAG · Entorno institucional</div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="search">
            <Search size={17} />
            <input aria-label="Buscar" placeholder="Buscar en el sistema" />
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notificaciones"><Bell size={18} /></button>
            <div className="profile-chip">
              <div className="avatar">AR</div>
              <span><strong>Ana Rodríguez</strong><br />Administrador</span>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
