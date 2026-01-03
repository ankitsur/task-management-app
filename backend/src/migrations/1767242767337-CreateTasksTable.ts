import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1767242767337 implements MigrationInterface {
  name = 'CreateTasksTable1767242767337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'PENDING', "priority" "public"."tasks_priority_enum", "due_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tasks_due_date" ON "tasks" ("due_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tasks_priority" ON "tasks" ("priority")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_tasks_status" ON "tasks" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_tasks_status"`);
    await queryRunner.query(`DROP INDEX "public"."idx_tasks_priority"`);
    await queryRunner.query(`DROP INDEX "public"."idx_tasks_due_date"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
}
