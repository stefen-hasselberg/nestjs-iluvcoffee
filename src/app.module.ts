import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  controllers: [AppController, CoffeesController],
  providers: [AppService],
})
export class AppModule {}
