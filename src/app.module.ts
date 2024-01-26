import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfigEnv } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfigEnv],
      validationSchema: JoiValidationSchema
    }),//Carga las .env
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, `../public/`),
    }),
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokeminsdb'
    }),
    // MongooseModule.forRoot(`mongodb://localhost:27017/nest-pokemon`),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
