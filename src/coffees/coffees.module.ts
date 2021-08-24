import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Module({
  providers: [CoffeesService]
})
export class CoffeesModule {}
