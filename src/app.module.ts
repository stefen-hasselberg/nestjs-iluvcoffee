import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Coffee } from './coffees/entities/coffee.entity';
import { Flavour } from './coffees/entities/flaour.entity';
import { CoffeRatingModule } from './coffe-rating/coffe-rating.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      synchronize: true,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Coffee, Flavour],
      extra: {
        options: {
          trustServerCertificate: true,
        },
      },
    }),
    CoffeRatingModule,
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
