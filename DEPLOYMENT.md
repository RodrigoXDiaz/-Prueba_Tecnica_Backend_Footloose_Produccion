# 🚀 Guía de Deployment en Render

Esta guía te ayudará a desplegar el backend de Footloose en **Render** de forma rápida y sencilla.

---

## 📋 Prerrequisitos

1. **Cuenta en Render**: [Crear cuenta gratis](https://render.com/)
2. **Repositorio en GitHub/GitLab**: Tu código debe estar en un repositorio Git
3. **Firebase Project**: Proyecto configurado en Firebase Console
4. **Cloudinary Account** (opcional): Para almacenamiento de imágenes

---

## 🔧 Paso 1: Preparar Variables de Entorno

### 1.1 Obtener Credenciales de Firebase

#### Opción A: Usar Variables de Entorno (RECOMENDADO para Render)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **⚙️ Project Settings** > **Service Accounts**
4. Haz clic en **Generate new private key**
5. Se descargará un archivo JSON con las credenciales

Del archivo JSON descargado, necesitas estos valores:

```json
{
  "project_id": "tu-proyecto-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com"
}
```

### 1.2 Obtener Firebase Web API Key

1. En Firebase Console, ve a **⚙️ Project Settings** > **General**
2. En la sección "Your apps", busca **Web API Key**
3. Copia el valor (ejemplo: `AIzaSyC...`)

### 1.3 Obtener Credenciales de Cloudinary (Opcional)

1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copia la **CLOUDINARY_URL** completa que aparece en el dashboard
   - Formato: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`

---

## 🚀 Paso 2: Desplegar en Render

### 2.1 Crear Nuevo Web Service

1. Inicia sesión en [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub/GitLab
4. Selecciona el repositorio del backend

### 2.2 Configurar el Web Service

Completa los campos con estos valores:

| Campo | Valor |
|-------|-------|
| **Name** | `footloose-backend-api` (o el nombre que prefieras) |
| **Region** | Oregon (o el más cercano a ti) |
| **Branch** | `main` o `master` |
| **Root Directory** | (dejar vacío si el backend está en la raíz) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Instance Type** | `Free` (o el plan que prefieras) |

### 2.3 Configurar Variables de Entorno

En la sección **Environment Variables**, agrega las siguientes variables:

#### Variables Obligatorias:

```bash
NODE_ENV=production
PORT=10000
API_PREFIX=api/v1

# Firebase - Reemplaza con tus valores reales
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
FIREBASE_WEB_API_KEY=AIzaSyC...tu-api-key-real

# ⚠️ IMPORTANTE: La private key debe ir entre comillas
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----"
```

> **💡 Tip**: Para `FIREBASE_PRIVATE_KEY`, copia el valor completo del JSON incluyendo `\n` y envuélvelo en comillas dobles.

#### Variables Opcionales:

```bash
# Cloudinary (si usas imágenes)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Email (si usas notificaciones por email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
EMAIL_FROM=noreply@tuapp.com

# CORS - Especifica tu frontend o usa * para todos
CORS_ORIGIN=*
```

### 2.4 Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. El proceso toma aproximadamente 2-5 minutos

---

## ✅ Paso 3: Verificar el Deployment

### 3.1 Ver Logs

1. Una vez desplegado, ve a la pestaña **"Logs"**
2. Deberías ver algo como:

```
Aplicación iniciada exitosamente
Servidor: https://footloose-backend-api.onrender.com
Swagger: https://footloose-backend-api.onrender.com/api/docs
Firebase API Key: Configurada
```

### 3.2 Probar la API

1. **Health Check**: Abre en tu navegador:
   ```
   https://tu-app.onrender.com/api/v1/health
   ```

2. **Documentación Swagger**: Abre:
   ```
   https://tu-app.onrender.com/api/docs
   ```

3. **Test de Registro**: Usa Postman o curl:
   ```bash
   curl -X POST https://tu-app.onrender.com/api/v1/auth/register \
   -H "Content-Type: application/json" \
   -d '{
     "email": "test@example.com",
     "password": "Test123456",
     "displayName": "Test User",
     "role": "VENDEDOR"
   }'
   ```

---

## 🔄 Paso 4: Auto-Deployment (CI/CD)

Render automáticamente re-desplegará tu aplicación cada vez que hagas push a la rama configurada (ej: `main`).

Para desactivar auto-deployment:
1. Ve a **Settings** → **Build & Deploy**
2. Desactiva **"Auto-Deploy"**

---

## 🌐 Paso 5: Conectar con tu Frontend

### URL de tu API

Tu API estará disponible en:
```
https://tu-app-name.onrender.com
```

### Configurar CORS

Si tu frontend está en un dominio específico, actualiza la variable de entorno:

```bash
CORS_ORIGIN=https://tu-frontend.com,https://www.tu-frontend.com
```

### Actualizar Frontend

En tu aplicación frontend, actualiza la URL base de la API:

```javascript
// Ejemplo en JavaScript/TypeScript
const API_URL = 'https://tu-app-name.onrender.com/api/v1';
```

---

## 🐛 Troubleshooting

### Problema: Error "Firebase credentials not configured"

**Solución**: Verifica que `FIREBASE_PRIVATE_KEY` esté entre comillas y contenga los saltos de línea (`\n`)

### Problema: Error 503 "Service Unavailable"

**Solución**: 
- Render pone en "sleep" las apps gratuitas después de 15 minutos de inactividad
- La primera petición puede tardar 30-60 segundos en despertar

### Problema: Build fallido

**Solución**:
1. Revisa los logs en la pestaña "Logs"
2. Asegúrate de que `package.json` tenga el script `build`:
   ```json
   "scripts": {
     "build": "nest build"
   }
   ```

### Problema: App corre localmente pero falla en Render

**Solución**:
- Revisa que todas las variables de entorno estén configuradas
- Verifica que no haya rutas absolutas hardcodeadas
- Asegúrate de que el puerto sea el correcto (Render usa la variable `PORT`)

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En Render Dashboard, selecciona tu servicio
2. Ve a la pestaña **"Logs"**
3. Los logs se actualizan en tiempo real

### Métricas

En la pestaña **"Metrics"** puedes ver:
- CPU usage
- Memory usage
- Request count
- Response times

---

## 💰 Costos

### Plan Free (Gratis)

- ✅ 750 horas de compute/mes
- ✅ SSL automático
- ✅ Auto-deployment desde Git
- ⚠️ Se duerme después de 15 minutos de inactividad
- ⚠️ 512 MB RAM

### Planes Pagos (desde $7/mes)

- ✅ Siempre activo (no se duerme)
- ✅ Más RAM y CPU
- ✅ Dominios personalizados
- ✅ Mejor rendimiento

---

## 🔐 Seguridad

### Mejores Prácticas

1. **Nunca** subas archivos `.env` al repositorio
2. Usa **Environment Variables** en Render para secretos
3. Mantén actualizadas las dependencias con `npm audit`
4. Configura CORS solo para tus dominios en producción
5. Usa HTTPS siempre (Render lo provee gratis)

### Variables Sensibles

Estas variables **NUNCA** deben estar en el código:
- `FIREBASE_PRIVATE_KEY`
- `CLOUDINARY_URL`
- `SMTP_PASSWORD`

---

## 🎉 ¡Listo!

Tu backend de Footloose está ahora desplegado en producción. 

### URLs Importantes:

- **API Base**: `https://tu-app.onrender.com/api/v1`
- **Swagger Docs**: `https://tu-app.onrender.com/api/docs`
- **Health Check**: `https://tu-app.onrender.com/api/v1/health`

### Próximos Pasos:

1. ✅ Prueba todos los endpoints desde Swagger
2. ✅ Configura tu frontend para usar esta URL
3. ✅ Monitorea los logs regularmente
4. ✅ Considera actualizar a un plan pago si necesitas mejor rendimiento

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Render Dashboard
2. Consulta la [documentación de Render](https://render.com/docs)
3. Verifica la [documentación de Firebase](https://firebase.google.com/docs)

---

**¡Happy Deploying! 🚀**
