import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) not need as we set this globally
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number) not need as we set this globally
  offset: number;
}
