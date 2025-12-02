# 🚀 Comandos para Desplegar

Este archivo contiene los comandos que necesitas ejecutar para preparar y desplegar tu backend.

---

## 📦 Paso 1: Verificar los Cambios

```powershell
# Ver qué archivos han cambiado
git status

# Ver los cambios en detalle
git diff
```

---

## 🔧 Paso 2: Preparar para Git

```powershell
# Agregar todos los archivos nuevos y modificados
git add .

# O agregar archivos específicos
git add render.yaml
git add .env.production
git add Procfile
git add DEPLOYMENT.md
git add PRODUCTION.md
git add PRODUCTION-CHANGES.md
git add package.json
git add tsconfig.json
git add tsconfig.build.json
git add .gitignore
git add .dockerignore
git add src/main.ts
git add src/app.module.ts
git add src/health.controller.ts
git add src/shared/firebase/firebase.module.ts
git add README.md
```

---

## 💾 Paso 3: Commit

```powershell
# Hacer commit con mensaje descriptivo
git commit -m "🚀 Preparar backend para producción en Render

- Agregar configuración de Render (render.yaml)
- Crear endpoint de health check
- Optimizar main.ts para producción
- Mejorar configuración de Firebase para variables de entorno
- Actualizar package.json con scripts de producción
- Agregar documentación completa de deployment
- Configurar CORS dinámico
- Mejorar logging y manejo de errores
- Actualizar .gitignore para proteger credenciales
- Agregar tsconfig.build.json optimizado"
```

---

## 📤 Paso 4: Push a GitHub/GitLab

```powershell
# Si es la primera vez
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main

# Si ya existe el repositorio
git push origin main
```

---

## 🌐 Paso 5: Desplegar en Render

### Opción A: Usando render.yaml (Automático)

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio
4. Render detectará automáticamente el `render.yaml`
5. Configura las variables de entorno
6. Click en **"Apply"**

### Opción B: Manual

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio
4. Configuración:
   ```
   Name: footloose-backend-api
   Region: Oregon
   Branch: main
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```
5. Agregar variables de entorno (ver .env.production)
6. Click en **"Create Web Service"**

---

## 🔐 Paso 6: Configurar Variables de Entorno en Render

En Render Dashboard → Tu servicio → Environment:

### Obligatorias:
```bash
NODE_ENV=production
PORT=10000
API_PREFIX=api/v1

# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
FIREBASE_WEB_API_KEY=AIzaSyC...
```

### Opcionales:
```bash
# Cloudinary
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
EMAIL_FROM=noreply@tuapp.com

# CORS
CORS_ORIGIN=*
```

---

## ✅ Paso 7: Verificar Deployment

```powershell
# Health Check
curl https://tu-app.onrender.com/api/v1/health

# Debería responder:
# {
#   "status": "ok",
#   "timestamp": "2025-12-02T10:30:00.000Z",
#   "uptime": 123.456,
#   "environment": "production",
#   "version": "1.0.0"
# }
```

Abre en el navegador:
- Swagger: `https://tu-app.onrender.com/api/docs`

---

## 🔄 Actualizaciones Futuras

Para actualizar el código en producción:

```powershell
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Descripción de cambios"
git push origin main

# 3. Render automáticamente re-desplegará
```

---

## 🐛 Troubleshooting

### Ver logs de Render

1. Ve a Render Dashboard
2. Selecciona tu servicio
3. Click en "Logs"

### Forzar re-deploy

1. Ve a Render Dashboard
2. Selecciona tu servicio
3. Click en "Manual Deploy" → "Deploy latest commit"

### Verificar variables de entorno

En Render Dashboard → Environment, asegúrate que todas las variables estén configuradas correctamente.

---

## 📚 Documentación Adicional

- **Guía Completa**: Ver `DEPLOYMENT.md`
- **Checklist**: Ver `PRODUCTION.md`
- **Cambios Realizados**: Ver `PRODUCTION-CHANGES.md`

---

## 🎉 ¡Listo!

Tu backend de Footloose está ahora en producción en Render.

**URLs finales:**
- API: `https://tu-app.onrender.com/api/v1`
- Docs: `https://tu-app.onrender.com/api/docs`
- Health: `https://tu-app.onrender.com/api/v1/health`

¡Happy Coding! 🚀
