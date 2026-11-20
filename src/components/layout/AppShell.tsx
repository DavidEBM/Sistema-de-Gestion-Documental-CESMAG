"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarCheck,
  CircleHelp,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  X,
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
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [systemDialog, setSystemDialog] = useState<"help" | "status" | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setSystemDialog(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((collapsed) => {
      const nextCollapsed = !collapsed;
      
      return nextCollapsed;
    });
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-identity">
            <Image
              className="brand-logo"
              src="/logo/logo_color_unicesmag.png"
              alt="CESMAG"
              width={44}
              height={44}
              priority
            />
            <div className="brand-name">Gestión Documental Institucional</div>
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral"}
            aria-pressed={sidebarCollapsed}
            title={sidebarCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
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
            <button className="icon-button" type="button" aria-label="Notificaciones"><Bell size={18} /></button>
            <div className="profile-menu" ref={profileMenuRef}>
              <button
                className="profile-chip"
                type="button"
                aria-label="Abrir menú de usuario"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <div className="avatar">AR</div>
                <span><strong>Ana Rodríguez</strong><br />Administrador</span>
                <Menu className="profile-menu-icon" size={19} />
              </button>
              {profileMenuOpen && (
                <div className="profile-dropdown" role="menu">
                  <button type="button" role="menuitem" onClick={() => { setSystemDialog("help"); setProfileMenuOpen(false); }}>
                    <CircleHelp size={17} /> Ayuda
                  </button>
                  <button type="button" role="menuitem" onClick={() => { setSystemDialog("status"); setProfileMenuOpen(false); }}>
                    <ShieldCheck size={17} /> Revisar estado del sistema
                  </button>
                  <div className="profile-dropdown-divider" />
                  <button className="logout-option" type="button" role="menuitem" onClick={() => router.push("/login")}>
                    <LogOut size={17} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {systemDialog && (
          <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSystemDialog(null); }}>
            <section className="system-dialog" role="dialog" aria-modal="true" aria-labelledby="system-dialog-title">
              <button className="dialog-close" type="button" aria-label="Cerrar" onClick={() => setSystemDialog(null)}><X size={18} /></button>
              {systemDialog === "help" ? (
                <>
                  <div className="dialog-icon"><CircleHelp size={22} /></div>
                  <h2 id="system-dialog-title">Centro de ayuda</h2>
                  <p>Seleccione una sección del menú lateral para gestionar actividades, informes, registros SNIES y su perfil institucional.</p>
                  <a className="primary" href="mailto:soporte@cesmag.edu.co">Contactar soporte</a>
                </>
              ) : (
                <>
                  <div className="dialog-icon status-ok"><ShieldCheck size={22} /></div>
                  <h2 id="system-dialog-title">Sistema operativo</h2>
                  <p>Todos los servicios institucionales están disponibles.</p>
                  <div className="status-grid"><span>Aplicación <strong>Operativa</strong></span><span>Base de datos <strong>Conectada</strong></span></div>
                </>
              )}
            </section>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
