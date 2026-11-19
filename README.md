# Sistema Institucional de Gestión Documental — CESMAG

Aplicación Next.js para administrar actividades institucionales, informes, registros SNIES y la integración con Google Drive.

## Instalación

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

## Variables principales

- `DATABASE_URL` y `DIRECT_URL`: conexiones pooled/directa de Neon PostgreSQL.
- `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`: configuración de Auth.js.
- `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`: credenciales OAuth de Google Workspace.
- `INSTITUTION_DOMAIN`: dominio institucional autorizado; también se valida con la propiedad `hd` verificada por Google.
- `NEXT_PUBLIC_APP_NAME`: nombre visible de la aplicación.
- Variables de Google Drive y SNIES: conservar secretos en servidor y definirlos por entorno.

## Base de datos

```bash
npx prisma format
npx prisma migrate dev --name init
npx prisma generate
```

El esquema incluye usuarios, perfiles, dependencias, roles, permisos, actividades, informes, plantillas, versiones SNIES, documentos, aprobaciones, auditoría y trabajos de sincronización.

## Google Workspace

Configure en Google Cloud OAuth 2.0 para Web con callback `/api/auth/callback/google`, restricción al dominio institucional y permisos mínimos de Google Drive. Los usuarios deben existir previamente en PostgreSQL y tener estado activo. No existe registro público.

## Despliegue en Vercel

1. Conectar el repositorio a Vercel.
2. Registrar todas las variables necesarias.
3. Configurar las URL OAuth de producción y preview.
4. Ejecutar `npx prisma migrate deploy` contra Neon.
5. Configurar supervisión y respaldos de PostgreSQL.

Los formatos SNIES y plantillas de informes se importan y mapean desde archivos institucionales. La aplicación no presenta estructuras oficiales provisionales como formatos reales.
