import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRafactor1629971582689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `Alter Table "coffee" RENAME COLUMN "name" TO "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `Alter Table "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}
