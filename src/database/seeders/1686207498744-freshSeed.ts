import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class FreshSeed1686207498744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users(id, name, email, phone, contractNumber, image, roles, password, createdAt, updatedAt)
      VALUES 
      (
        gen_random_uuid(), 
        'John Doe', 
        'john@example.com', 
        '123456789', 
        '1234', 
        'john-image.jpg', 
        ARRAY ['user'], 
        '${await bcrypt.hash('password1', 10)}',
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      ),
      (
        gen_random_uuid(), 
        'Jane Doe', 
        'jane@example.com', 
        '987654321', 
        '5678', 
        'jane-image.jpg', 
        ARRAY ['admin'], 
        '${await bcrypt.hash('password2', 10)}',
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email IN ('john@example.com', 'jane@example.com');
    `);
  }
}
