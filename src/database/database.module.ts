import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('TYPEORM_HOST'),
        port: configService.getOrThrow('TYPEORM_PORT'),
        database: configService.getOrThrow('TYPEORM_DATABASE'),
        username: configService.getOrThrow('TYPEORM_USERNAME'),
        password: configService.getOrThrow('TYPEORM_PASSWORD'),
        logging: configService.getOrThrow('TYPEORM_LOGGING'),
        synchronize: configService.getOrThrow('TYPEORM_SYNCHRONIZE'),
        autoLoadEntities: true,
        ssl: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
