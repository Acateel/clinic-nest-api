import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from './common/app-config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  const configService = app.get(ConfigService<AppConfig>)
  const port = configService.getOrThrow('port')

  await app.listen(port)
}
bootstrap()
