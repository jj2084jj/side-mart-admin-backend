import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:5173', 'https://port-0-everyone-flyer-server-ac2nll4pdh1j.sel4.cloudtype.app'], // 로컬 및 원격 서버 도메인 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000); // 환경변수 PORT 사용, 없으면 3000
}
bootstrap();
