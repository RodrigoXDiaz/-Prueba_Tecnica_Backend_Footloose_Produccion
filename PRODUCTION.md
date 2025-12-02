# 🚀 Footloose Backend - Configuración de Producción

Este documento contiene información específica para el despliegue en producción del backend de Footloose.

---

## 📋 Checklist de Producción

Antes de desplegar, asegúrate de completar estos pasos:

### ✅ Configuración de Firebase

- [ ] Obtener credenciales de Firebase Service Account
- [ ] Configurar `FIREBASE_PROJECT_ID`
- [ ] Configurar `FIREBASE_PRIVATE_KEY`
- [ ] Configurar `FIREBASE_CLIENT_EMAIL`
- [ ] Configurar `FIREBASE_STORAGE_BUCKET`
- [ ] Configurar `FIREBASE_WEB_API_KEY`

### ✅ Configuración de Cloudinary (Opcional)

- [ ] Crear cuenta en Cloudinary
- [ ] Obtener `CLOUDINARY_URL`

### ✅ Configuración de Email (Opcional)

- [ ] Configurar servicio SMTP
- [ ] Generar App Password (si usas Gmail)
- [ ] Configurar variables SMTP

### ✅ Configuración de Render

- [ ] Crear cuenta en Render
- [ ] Conectar repositorio Git
- [ ] Configurar todas las variables de entorno
- [ ] Verificar Build Command: `npm install && npm run build`
- [ ] Verificar Start Command: `npm run start:prod`

---

## 🔐 Variables de Entorno Requeridas

### Variables Obligatorias

```bash
NODE_ENV=production
PORT=10000
API_PREFIX=api/v1

FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
FIREBASE_WEB_API_KEY=AIzaSyC...
```

### Variables Opcionales

```bash
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
EMAIL_FROM=noreply@tuapp.com
CORS_ORIGIN=*
```

---

## 🌐 URLs del Servicio

Una vez desplegado, tu API estará disponible en:

- **API Base**: `https://tu-app.onrender.com/api/v1`
- **Health Check**: `https://tu-app.onrender.com/api/v1/health`
- **Swagger Docs**: `https://tu-app.onrender.com/api/docs`

---

## 📊 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión

### Productos
- `GET /api/v1/products` - Listar productos
- `POST /api/v1/products` - Crear producto (Admin)
- `GET /api/v1/products/:id` - Obtener producto
- `PATCH /api/v1/products/:id` - Actualizar producto (Admin)
- `DELETE /api/v1/products/:id` - Eliminar producto (Admin)

### Servicios
- `POST /api/v1/services/import-excel` - Importar desde Excel
- `GET /api/v1/services/export-excel` - Exportar a Excel
- `POST /api/v1/services/generate-pdf/:id` - Generar PDF

### Notificaciones
- `POST /api/v1/notifications/subscribe` - Suscribirse a notificaciones
- `POST /api/v1/notifications/follow` - Seguir producto
- `GET /api/v1/notifications/history` - Historial de notificaciones

---

## 🔍 Monitoreo

### Health Check

El endpoint de health check proporciona información sobre el estado de la API:

```bash
curl https://tu-app.onrender.com/api/v1/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-12-02T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

### Logs

Para ver los logs en tiempo real:
1. Ve a Render Dashboard
2. Selecciona tu servicio
3. Ve a la pestaña "Logs"

---

## ⚡ Optimizaciones de Producción

### 1. Build Optimizado
El proyecto está configurado para compilar TypeScript a JavaScript optimizado.

### 2. CORS Configurado
CORS está configurado para aceptar requests desde cualquier origen (`*`) o dominios específicos.

### 3. Validación de DTOs
Todos los endpoints usan validación automática con `class-validator`.

### 4. Manejo Global de Errores
Sistema de manejo de excepciones centralizado con respuestas consistentes.

### 5. Logging
Sistema de logging para todas las requests y responses.

### 6. Swagger/OpenAPI
Documentación interactiva de la API disponible en `/api/docs`.

---

## 🛠️ Troubleshooting

### Error: "Firebase credentials not configured"

**Causa**: Las variables de entorno de Firebase no están configuradas correctamente.

**Solución**:
1. Ve a Render Dashboard > Environment
2. Verifica que todas las variables de Firebase estén configuradas
3. Asegúrate de que `FIREBASE_PRIVATE_KEY` esté entre comillas dobles

### Error: "Service Unavailable" (503)

**Causa**: La app gratuita de Render se durmió por inactividad.

**Solución**: 
- Primera petición tarda 30-60 segundos en despertar
- Considera actualizar a plan pago para servicio 24/7

### Error: Build Failed

**Causa**: Error durante la compilación de TypeScript.

**Solución**:
1. Revisa los logs de build en Render
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de que no hay errores de TypeScript

### Error: CORS

**Causa**: El origen del frontend no está permitido.

**Solución**: Actualiza `CORS_ORIGIN` con la URL de tu frontend:
```bash
CORS_ORIGIN=https://tu-frontend.com,https://www.tu-frontend.com
```

---

## 🔄 Actualizaciones

### Auto-Deploy desde Git

Render re-desplegará automáticamente cuando hagas push a la rama principal.

### Deploy Manual

1. Ve a Render Dashboard
2. Selecciona tu servicio
3. Click en "Manual Deploy" > "Deploy latest commit"

---

## 📈 Escalabilidad

### Plan Free
- **Límite**: 750 horas/mes
- **RAM**: 512 MB
- **Sleep**: Después de 15 min de inactividad
- **Ideal para**: Desarrollo, demos, MVP

### Plan Starter ($7/mes)
- **RAM**: 512 MB
- **Siempre activo**: Sin sleep
- **Ideal para**: Producción pequeña

### Plan Standard ($25/mes)
- **RAM**: 2 GB
- **Siempre activo**: Sin sleep
- **Mejor CPU**: Más recursos
- **Ideal para**: Producción media/alta

---

## 🔒 Seguridad

### Mejores Prácticas Implementadas

✅ **Autenticación con Firebase**: Tokens JWT seguros  
✅ **Guards**: Protección de rutas por roles  
✅ **Validación**: Validación automática de inputs  
✅ **CORS**: Control de acceso por origen  
✅ **HTTPS**: SSL automático por Render  
✅ **Variables de entorno**: Secretos no expuestos en código

### Recomendaciones Adicionales

- 🔐 Cambia las claves regularmente
- 📊 Monitorea los logs regularmente
- 🔄 Mantén las dependencias actualizadas
- 🚫 No compartas credenciales
- ✅ Usa CORS específico en producción real

---

## 📞 Soporte

- **Render Docs**: https://render.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **NestJS Docs**: https://docs.nestjs.com

---

## 🎉 ¡Tu API está en Producción!

**URLs importantes:**
- 🌐 API: `https://tu-app.onrender.com/api/v1`
- 📚 Docs: `https://tu-app.onrender.com/api/docs`
- ❤️ Health: `https://tu-app.onrender.com/api/v1/health`

¡Happy Coding! 🚀
