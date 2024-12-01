import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://port-0-everyone-flyer-m31e80fff0b193b7.sel4.cloudtype.app',
      'https://mart-mon.netlify.app',
    ], // 로컬 및 원격 서버 도메인 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000); // 환경변수 PORT 사용, 없으면 3000
}
bootstrap();
