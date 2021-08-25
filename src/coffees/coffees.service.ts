import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeesRepository: Repository<Coffee>,
  ) {}

  async findAll() {
    return await this.coffeesRepository.find();
  }

  async findOne(id: string) {
    const coffee = this.coffeesRepository.findOne(+id);

    if (!coffee) {
      // throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  create(createdCoffeeDto: CreateCoffeeDto) {
    console.log(createdCoffeeDto instanceof CreateCoffeeDto);
    const coffee = this.coffeesRepository.create(createdCoffeeDto);
    return this.coffeesRepository.save(coffee);
  }

  async update(id: string, updatedCoffeeDto: UpdateCoffeeDto) {
    // preload fetches a copy of the entity
    // then we can replace any updated fields

    const coffee = await this.coffeesRepository.preload({
      id: +id,
      ...updatedCoffeeDto,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeesRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);

    return this.coffeesRepository.remove(coffee);
  }
}
