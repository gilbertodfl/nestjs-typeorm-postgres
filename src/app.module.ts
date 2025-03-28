import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  
  imports: [UserModule,
      ConfigModule.forRoot({
        envFilePath: process.env.ENV === 'test' ? '.env.test' : '.env',
      }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        // host: process.env.DB_HOST,
        // port    : Number( process.env.DB_PORT ),
        // username: process.env.DB_USERNAME,   
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME,

        host: 'localhost',
        port    : 5432,
        username: 'postgres',   
        password: 'postgres',
        database: 'postgres',


        //  '/**/*.entity{.ts,.js}': Esta parte especifica que o TypeORM deve buscar, no diretório definido pela 
        //   variável de ambiente, todos os arquivos que correspondam ao padrão *.entity.ts 
        //   ou *.entity.js, incluindo subdiretórios.
        entities: [__dirname + '/**/*.entity{.ts,.js}']  ,
        synchronize: process.env.ENV === 'development' 
      })
  ],
  providers: [AppService],
  controllers: [AppController],
  // Se develpment, então recrie o banco. 


})
export class AppModule {}
