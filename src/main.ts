import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);
  
  // Configuración de CORS para producción
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  app.enableCors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map(o => o.trim()),
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Catálogo de Productos API')
    .setDescription(
      'API REST para gestión de catálogo de productos con autenticación y roles',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Endpoints de autenticación y gestión de usuarios')
    .addTag('Products', 'Endpoints de gestión de productos')
    .addTag('Services', 'Servicios adicionales (Excel, PDF, Notificaciones)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  
  await app.listen(port, '0.0.0.0');

  const apiKey = configService.get<string>('FIREBASE_WEB_API_KEY');
  const apiKeyStatus = apiKey && apiKey !== 'AIzaSyDuJ8QYc9xVZqXxK_1234567890abcdefg' 
    ? '✅ Configurada' 
    : '❌ NO CONFIGURADA';

  // Obtener la URL base según el entorno
  const baseUrl = nodeEnv === 'production' 
    ? `https://${configService.get<string>('RENDER_EXTERNAL_HOSTNAME') || 'your-app.onrender.com'}`
    : `http://localhost:${port}`;

  console.log(`\n${'='.repeat(60)}`);
  console.log('🚀 Aplicación iniciada exitosamente');
  console.log(`${'='.repeat(60)}`);
  console.log(`🌍 Entorno: ${nodeEnv.toUpperCase()}`);
  console.log(`🔌 Puerto: ${port}`);
  console.log(`📡 API Base: ${baseUrl}/${apiPrefix}`);
  console.log(`📚 Swagger Docs: ${baseUrl}/api/docs`);
  console.log(`❤️  Health Check: ${baseUrl}/${apiPrefix}/health`);
  console.log(`🔥 Firebase API Key: ${apiKeyStatus}`);
  console.log(`🌐 CORS: ${corsOrigin}`);
  console.log(`${'='.repeat(60)}\n`);

  if (!apiKey || apiKey === 'AIzaSyDuJ8QYc9xVZqXxK_1234567890abcdefg') {
    console.warn('⚠️  ADVERTENCIA: Firebase Web API Key no configurada correctamente');
    console.warn('⚠️  El login y registro NO funcionarán sin esta configuración');
    console.warn('⚠️  Configura FIREBASE_WEB_API_KEY en las variables de entorno\n');
  }
}

bootstrap().catch(err => {
  console.error('❌ Error fatal al iniciar la aplicación:', err);
  process.exit(1);
});
