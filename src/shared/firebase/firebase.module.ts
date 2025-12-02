import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';

/**
 * Proveedor de Firebase
 * Inicializa Firebase Admin SDK desde archivo JSON o variables de entorno
 */
const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
    
    // En producción, priorizar variables de entorno individuales
    // En desarrollo, permitir usar archivo JSON
    const serviceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    
    if (serviceAccountPath && nodeEnv !== 'production') {
      try {
        const absolutePath = path.resolve(process.cwd(), serviceAccountPath);
        const serviceAccount = require(absolutePath);
        
        console.log('✅ Firebase configurado desde archivo JSON');
        console.log(`📦 Proyecto: ${serviceAccount.project_id}`);
        console.log(`🗂️  Storage Bucket: ${configService.get<string>('FIREBASE_STORAGE_BUCKET')}`);
        
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
        });
      } catch (error) {
        console.warn('⚠️  No se pudo cargar el archivo Firebase JSON, intentando variables de entorno...');
        // Continuar con variables de entorno
      }
    }

    // Usar variables de entorno (recomendado para producción)
    const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY');
    const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const storageBucket = configService.get<string>('FIREBASE_STORAGE_BUCKET');

    if (!projectId || projectId === 'your-project-id' || 
        !privateKey || privateKey.includes('Your-Private-Key') ||
        !clientEmail || clientEmail.includes('xxxxx')) {
      console.error('\n❌ FIREBASE NOT CONFIGURED');
      console.error('Por favor configura las credenciales de Firebase:');
      console.error('En Render Dashboard > Environment:');
      console.error('  - FIREBASE_PROJECT_ID');
      console.error('  - FIREBASE_PRIVATE_KEY');
      console.error('  - FIREBASE_CLIENT_EMAIL');
      console.error('  - FIREBASE_STORAGE_BUCKET');
      console.error('\nVer DEPLOYMENT.md para instrucciones detalladas\n');
      
      throw new Error('Firebase credentials not configured. Please check environment variables.');
    }

    const firebaseConfig = {
      projectId,
      privateKey: privateKey?.replace(/\\n/g, '\n'),
      clientEmail,
    };

    console.log('✅ Firebase configurado desde variables de entorno');
    console.log(`📦 Proyecto: ${projectId}`);
    console.log(`🗂️  Storage Bucket: ${storageBucket}`);

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      storageBucket,
    });
  },
};

const firestoreProvider = {
  provide: 'FIRESTORE',
  inject: ['FIREBASE_APP'],
  useFactory: (firebaseApp: admin.app.App) => firebaseApp.firestore(),
};

const firebaseAuthProvider = {
  provide: 'FIREBASE_AUTH',
  inject: ['FIREBASE_APP'],
  useFactory: (firebaseApp: admin.app.App) => firebaseApp.auth(),
};

const firebaseStorageProvider = {
  provide: 'FIREBASE_STORAGE',
  inject: ['FIREBASE_APP'],
  useFactory: (firebaseApp: admin.app.App) => firebaseApp.storage(),
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    firebaseProvider,
    firestoreProvider,
    firebaseAuthProvider,
    firebaseStorageProvider,
  ],
  exports: [
    'FIREBASE_APP',
    'FIRESTORE',
    'FIREBASE_AUTH',
    'FIREBASE_STORAGE',
  ],
})
export class FirebaseModule {}
