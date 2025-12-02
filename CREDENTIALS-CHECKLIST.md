# 🔑 Checklist de Credenciales para Render

Usa esta lista para asegurarte de tener todas las credenciales necesarias antes de desplegar.

---

## ✅ Firebase Credentials

### 1. Firebase Service Account (Obligatorio)

**¿Dónde obtenerlo?**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Click en ⚙️ **Project Settings**
4. Ve a la pestaña **Service Accounts**
5. Click en **Generate new private key**
6. Se descargará un archivo JSON

**Del archivo JSON necesitas:**

```json
{
  "project_id": "tu-proyecto-id",  // ← FIREBASE_PROJECT_ID
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",  // ← FIREBASE_PRIVATE_KEY
  "client_email": "firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com"  // ← FIREBASE_CLIENT_EMAIL
}
```

### 2. Firebase Web API Key (Obligatorio para Auth)

**¿Dónde obtenerlo?**
1. En Firebase Console → ⚙️ **Project Settings**
2. Pestaña **General**
3. Sección "Your apps"
4. Busca **Web API Key**

**Formato:**
```
AIzaSyC_ejemplo_de_api_key_32_caracteres
```

### 3. Firebase Storage Bucket (Obligatorio)

**¿Dónde obtenerlo?**
- En Firebase Console → ⚙️ **Project Settings** → **General**
- O simplemente usa: `tu-proyecto-id.appspot.com`

---

## ✅ Cloudinary (Opcional - Para imágenes)

**¿Dónde obtenerlo?**
1. Crea cuenta en [Cloudinary](https://cloudinary.com/)
2. Ve al Dashboard
3. Copia la **CLOUDINARY_URL** completa

**Formato:**
```
cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWx@tu-cloud-name
```

---

## ✅ SMTP Email (Opcional - Para notificaciones)

### Opción 1: Gmail

**Pasos:**
1. Habilita 2-Step Verification en tu cuenta Google
2. Ve a [App Passwords](https://myaccount.google.com/apppasswords)
3. Genera una App Password

**Configuración:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  (16 caracteres sin espacios)
EMAIL_FROM=noreply@tuapp.com
```

### Opción 2: Otros proveedores

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=tu-api-key-de-sendgrid
```

**Mailgun:**
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@tu-dominio.mailgun.org
SMTP_PASSWORD=tu-password-de-mailgun
```

---

## 📋 Template para Render Environment Variables

Copia y pega esto en Render → Environment, reemplazando con tus valores reales:

```bash
# ========================================
# OBLIGATORIAS
# ========================================

NODE_ENV=production
PORT=10000
API_PREFIX=api/v1

# Firebase (TODAS OBLIGATORIAS)
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCB...
-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
FIREBASE_WEB_API_KEY=AIzaSyC_tu_api_key_aqui

# ========================================
# OPCIONALES
# ========================================

# Cloudinary (para imágenes)
CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGh@tu-cloud-name

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=noreply@tuapp.com

# CORS
CORS_ORIGIN=*
```

---

## ⚠️ Notas Importantes

### FIREBASE_PRIVATE_KEY

**❌ INCORRECTO:**
```bash
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQ...
-----END PRIVATE KEY-----
```

**✅ CORRECTO:**
```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
```

**Puntos clave:**
1. Debe estar entre comillas dobles
2. Los saltos de línea son literales `\n` (no enter)
3. Incluir BEGIN y END PRIVATE KEY

---

## 🔍 Verificación

### Checklist antes de desplegar:

- [ ] Tengo el archivo JSON de Firebase Service Account
- [ ] Extraje `project_id`, `private_key` y `client_email`
- [ ] Obtuve el Firebase Web API Key
- [ ] Sé cuál es mi Storage Bucket
- [ ] (Opcional) Tengo credenciales de Cloudinary
- [ ] (Opcional) Configuré SMTP y App Password
- [ ] Copié el template de variables de entorno
- [ ] Reemplacé todos los valores de ejemplo con los reales

---

## 🧪 Testing de Credenciales

### Test 1: Firebase Auth (Local)

```bash
# Crear archivo test-firebase.js
node test-firebase.js
```

```javascript
// test-firebase.js
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('✅ Firebase configurado correctamente');
console.log('Project ID:', serviceAccount.project_id);
```

### Test 2: Cloudinary (Local)

```bash
npm install cloudinary
node test-cloudinary.js
```

```javascript
// test-cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'tu-cloud-name',
  api_key: 'tu-api-key',
  api_secret: 'tu-api-secret'
});

cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary conectado'))
  .catch(err => console.error('❌ Error:', err));
```

---

## 📞 Ayuda

### Si Firebase falla:

1. Verifica que el proyecto esté activo en Firebase Console
2. Asegúrate de habilitar Authentication → Email/Password
3. Verifica que Firestore esté creado
4. Revisa que las credenciales sean del proyecto correcto

### Si Cloudinary falla:

1. Verifica que tu plan tenga API habilitada
2. Revisa que los valores sean correctos
3. Asegúrate de usar el formato de URL completo

### Si SMTP falla:

1. Para Gmail, verifica que 2-Step Verification esté activo
2. Usa App Password, no tu contraseña normal
3. Verifica que el puerto y host sean correctos

---

## ✅ ¡Todo Listo!

Una vez que tengas todas estas credenciales:

1. Configúralas en Render → Environment
2. Haz deploy
3. Verifica el health check
4. Prueba los endpoints desde Swagger

**¡Tu backend estará listo para producción! 🚀**
