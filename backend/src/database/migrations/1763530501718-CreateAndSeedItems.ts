import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAndSeedItems1763530501718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Создаем таблицу
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Starting to seed 100,000 items...');

    // 2. Наполняем данными
    await queryRunner.query(`
      INSERT INTO items (name, created_at)
      SELECT 
        'Item ' || generate_series(1, 100000),
        NOW() - (random() * INTERVAL '1000 days')
    `);

    console.log('Finished seeding 100,000 items');

    // 3. Добавляем индекс для оптимизации пагинации
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_items_created_at_desc 
      ON items(created_at DESC)
    `);

    console.log('Index created successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS idx_items_created_at_desc');
    await queryRunner.query('DROP TABLE IF EXISTS items');
  }
}
