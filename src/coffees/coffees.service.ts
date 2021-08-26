import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavour } from './entities/flaour.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { query } from 'express';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeesRepository: Repository<Coffee>,
    @InjectRepository(Flavour)
    private readonly flavourRepository: Repository<Flavour>,
    private readonly connection: Connection,
  ) {}

  async findAll(pagination: PaginationQueryDto) {
    const { limit, offset } = pagination;
    return await this.coffeesRepository.find({
      relations: ['flavours'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const coffee = this.coffeesRepository.findOne(+id, {
      relations: ['flavours'],
    });

    if (!coffee) {
      // throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create(createdCoffeeDto: CreateCoffeeDto) {
    const flavours = await Promise.all(
      createdCoffeeDto.flavours.map((name) => this.preloadFlavourByName(name)),
    );
    console.log(createdCoffeeDto instanceof CreateCoffeeDto);
    const coffee = this.coffeesRepository.create({
      ...createdCoffeeDto,
      flavours,
    });
    return this.coffeesRepository.save(coffee);
  }

  async update(id: string, updatedCoffeeDto: UpdateCoffeeDto) {
    // preload fetches a copy of the entity
    // then we can replace any updated fields
    const flavours =
      updatedCoffeeDto.flavours &&
      (await Promise.all(
        updatedCoffeeDto.flavours.map((name) =>
          this.preloadFlavourByName(name),
        ),
      ));

    const coffee = await this.coffeesRepository.preload({
      id: +id,
      ...updatedCoffeeDto,
      flavours,
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

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendation++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = '{coffeeId: coffee.id}';

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavourByName(name: string) {
    const exisitingFlavour = await this.flavourRepository.findOne({ name });

    if (exisitingFlavour) {
      return exisitingFlavour;
    }
    return this.flavourRepository.create({ name });
  }
}
